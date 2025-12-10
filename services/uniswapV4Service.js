const { ethers } = require('ethers');
const { QUOTER_V2_ABI, QUOTER_ETH_ABI, STATE_VIEW_ABI, ERC20_ABI } = require('../config/abis');
const { NETWORKS } = require('../config/networks');

class UniswapV4Service {
  
  async getTokenInfo(tokenAddress, provider) {
    if (tokenAddress === ethers.ZeroAddress) {
      return { symbol: 'ETH', name: 'Ethereum', decimals: 18 };
    }
    
    try {
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const [symbol, name, decimals] = await Promise.all([
        token.symbol(),
        token.name(),
        token.decimals()
      ]);
      return { symbol, name, decimals: Number(decimals) };
    } catch (error) {
      return { symbol: 'Unknown', name: 'Unknown Token', decimals: 18 };
    }
  }

  calculatePrice(sqrtPriceX96, decimals0 = 18, decimals1 = 18) {
    const Q96 = BigInt(2) ** BigInt(96);
    const sqrtPrice = BigInt(sqrtPriceX96.toString());
    
    const numerator = sqrtPrice * sqrtPrice * BigInt(10 ** decimals0);
    const denominator = Q96 * Q96 * BigInt(10 ** decimals1);
    
    return Number(numerator / denominator) + Number(numerator % denominator) / Number(denominator);
  }

  async queryPool(poolId, network) {
    const networkConfig = NETWORKS[network];
    if (!networkConfig || !networkConfig.dex.uniswapV4) {
      throw new Error(`Uniswap V4 not supported on ${network}`);
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    const isEthereum = network === 'ETH';
    const quoterABI = isEthereum ? QUOTER_ETH_ABI : QUOTER_V2_ABI;
    
    const quoter = new ethers.Contract(
      networkConfig.dex.uniswapV4.quoterV2,
      quoterABI,
      provider
    );
    const stateView = new ethers.Contract(
      networkConfig.dex.uniswapV4.stateView,
      STATE_VIEW_ABI,
      provider
    );

    try {
      const poolKey = await quoter.getPoolKey(poolId);
      
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      if (poolKey.currency0 === zeroAddress && poolKey.currency1 === zeroAddress) {
        return null;
      }

      const [token0Info, token1Info] = await Promise.all([
        this.getTokenInfo(poolKey.currency0, provider),
        this.getTokenInfo(poolKey.currency1, provider)
      ]);

      let slot0, liquidity, reserves;
      
      if (isEthereum) {
        [slot0, liquidity, reserves] = await Promise.all([
          stateView.getSlot0(poolId),
          stateView.getLiquidity(poolId),
          quoter.getUniswapV4PoolReserve(poolKey)
        ]);
      } else {
        [slot0, liquidity] = await Promise.all([
          stateView.getSlot0(poolId),
          stateView.getLiquidity(poolId)
        ]);
      }

      const price = this.calculatePrice(
        slot0.sqrtPriceX96,
        token0Info.decimals,
        token1Info.decimals
      );

      const result = {
        network: networkConfig.name,
        dex: 'Uniswap V4',
        poolId: poolId,
        token0: {
          address: poolKey.currency0,
          symbol: token0Info.symbol,
          name: token0Info.name,
          decimals: token0Info.decimals
        },
        token1: {
          address: poolKey.currency1,
          symbol: token1Info.symbol,
          name: token1Info.name,
          decimals: token1Info.decimals
        },
        fee: Number(poolKey.fee),
        feePercent: Number(poolKey.fee) / 10000,
        tickSpacing: Number(poolKey.tickSpacing),
        hooks: poolKey.hooks,
        state: {
          sqrtPriceX96: slot0.sqrtPriceX96.toString(),
          tick: Number(slot0.tick),
          liquidity: liquidity.toString(),
          lpFee: Number(slot0.lpFee),
          protocolFee: Number(slot0.protocolFee),
          price: price,
          priceFormatted: price.toExponential(6)
        },
        contracts: {
          poolManager: networkConfig.dex.uniswapV4.poolManager,
          quoterV2: networkConfig.dex.uniswapV4.quoterV2,
          stateView: networkConfig.dex.uniswapV4.stateView
        },
        explorer: `${networkConfig.explorer}/address/${poolKey.currency0}`
      };

      if (isEthereum && reserves) {
        result.state.reserve0 = reserves.reserve0.toString();
        result.state.reserve1 = reserves.reserve1.toString();
      }

      return result;

    } catch (error) {
      throw new Error(`Failed to query Uniswap V4 pool: ${error.message}`);
    }
  }

  async queryPoolAcrossNetworks(poolId) {
    for (const [key, network] of Object.entries(NETWORKS)) {
      if (network.dex.uniswapV4) {
        try {
          const result = await this.queryPool(poolId, key);
          if (result) {
            return result;
          }
        } catch (error) {
          continue;
        }
      }
    }
    return null;
  }
}

module.exports = new UniswapV4Service();
