const { ethers } = require('ethers');
const { UNISWAP_V3_POOL_ABI, ERC20_ABI } = require('../config/abis');
const { NETWORKS } = require('../config/networks');

class PancakeV3Service {
  
  async getTokenInfo(tokenAddress, provider) {
    if (tokenAddress === ethers.ZeroAddress) {
      return { symbol: 'BNB', name: 'BNB', decimals: 18 };
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

  async queryPool(poolAddress, network) {
    const networkConfig = NETWORKS[network];
    if (!networkConfig || !networkConfig.dex.pancakeV3) {
      throw new Error(`PancakeSwap V3 not supported on ${network}`);
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    const pool = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, provider);

    try {
      const [token0Address, token1Address, fee, tickSpacing, slot0, liquidity] = await Promise.all([
        pool.token0(),
        pool.token1(),
        pool.fee(),
        pool.tickSpacing(),
        pool.slot0(),
        pool.liquidity()
      ]);

      const [token0Info, token1Info] = await Promise.all([
        this.getTokenInfo(token0Address, provider),
        this.getTokenInfo(token1Address, provider)
      ]);

      const price = this.calculatePrice(
        slot0.sqrtPriceX96,
        token0Info.decimals,
        token1Info.decimals
      );

      return {
        network: networkConfig.name,
        dex: 'PancakeSwap V3',
        poolType: 'V3',
        poolAddress: poolAddress,
        token0: {
          address: token0Address,
          symbol: token0Info.symbol,
          name: token0Info.name,
          decimals: token0Info.decimals
        },
        token1: {
          address: token1Address,
          symbol: token1Info.symbol,
          name: token1Info.name,
          decimals: token1Info.decimals
        },
        fee: Number(fee),
        feePercent: Number(fee) / 10000,
        tickSpacing: Number(tickSpacing),
        state: {
          sqrtPriceX96: slot0.sqrtPriceX96.toString(),
          tick: Number(slot0.tick),
          liquidity: liquidity.toString(),
          observationIndex: Number(slot0.observationIndex),
          observationCardinality: Number(slot0.observationCardinality),
          price: price,
          priceFormatted: price.toExponential(6)
        },
        contracts: {
          pool: poolAddress,
          factory: networkConfig.dex.pancakeV3.factory
        },
        explorer: `${networkConfig.explorer}/address/${poolAddress}`
      };

    } catch (error) {
      throw new Error(`Failed to query PancakeSwap V3 pool: ${error.message}`);
    }
  }

  async queryPoolAcrossNetworks(poolAddress) {
    for (const [key, network] of Object.entries(NETWORKS)) {
      if (network.dex.pancakeV3) {
        try {
          const result = await this.queryPool(poolAddress, key);
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

module.exports = new PancakeV3Service();
