const { ethers } = require('ethers');
const { PANCAKE_CL_POOL_MANAGER_ABI, ERC20_ABI } = require('../config/abis');
const { NETWORKS } = require('../config/networks');

class PancakeV4Service {
  
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

  extractTickSpacing(parameters) {
    try {
      // Parameters is a bytes32 value where tickSpacing is encoded
      // Based on PancakeSwap V4 CL, tickSpacing is at byte index 29
      const parametersBytes = ethers.getBytes(parameters);
      
      // tickSpacing is stored at byte 29 as int8
      let tickSpacing = parametersBytes[29];
      
      // Handle sign bit for int8 (if value > 127, it's negative)
      if (tickSpacing > 127) {
        tickSpacing -= 256;
      }
      
      return tickSpacing;
    } catch (error) {
      return 0;
    }
  }

  async queryPool(poolId, network) {
    const networkConfig = NETWORKS[network];
    if (!networkConfig || !networkConfig.dex.pancakeV4CL) {
      throw new Error(`PancakeSwap V4 CL not supported on ${network}`);
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    const poolManager = new ethers.Contract(
      networkConfig.dex.pancakeV4CL.poolManager,
      PANCAKE_CL_POOL_MANAGER_ABI,
      provider
    );

    try {
      const poolKey = await poolManager.poolIdToPoolKey(poolId);
      
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      if (poolKey.currency0 === zeroAddress && poolKey.currency1 === zeroAddress) {
        return null;
      }

      const [slot0, liquidity, token0Info, token1Info] = await Promise.all([
        poolManager.getSlot0(poolId),
        poolManager.getLiquidity(poolId),
        this.getTokenInfo(poolKey.currency0, provider),
        this.getTokenInfo(poolKey.currency1, provider)
      ]);

      const tickSpacing = this.extractTickSpacing(poolKey.parameters);
      const price = this.calculatePrice(
        slot0.sqrtPriceX96,
        token0Info.decimals,
        token1Info.decimals
      );

      return {
        network: networkConfig.name,
        dex: 'PancakeSwap V4 CL',
        poolType: 'CL',
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
        tickSpacing: tickSpacing,
        hooks: poolKey.hooks,
        parameters: poolKey.parameters,
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
          poolManager: networkConfig.dex.pancakeV4CL.poolManager
        },
        explorer: `${networkConfig.explorer}/address/${poolKey.currency0}`
      };

    } catch (error) {
      throw new Error(`Failed to query PancakeSwap V4 CL pool: ${error.message}`);
    }
  }

  async queryPoolAcrossNetworks(poolId) {
    for (const [key, network] of Object.entries(NETWORKS)) {
      if (network.dex.pancakeV4CL) {
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

module.exports = new PancakeV4Service();
