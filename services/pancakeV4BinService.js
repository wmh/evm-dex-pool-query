const { ethers } = require('ethers');
const { PANCAKE_BIN_POOL_MANAGER_ABI, ERC20_ABI } = require('../config/abis');
const { NETWORKS } = require('../config/networks');

class PancakeV4BinService {
  
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

  calculateBinPrice(activeId, binStep = 1) {
    // Bin pool price calculation
    // price = (1 + binStep / 10000) ^ (activeId - 2^23)
    const BASE_OFFSET = 8388608; // 2^23
    const adjustedId = Number(activeId) - BASE_OFFSET;
    const binStepDecimal = binStep / 10000;
    return Math.pow(1 + binStepDecimal, adjustedId);
  }

  extractBinStep(parameters) {
    try {
      // Parameters encoding (256-bit value):
      // - Bits 0-15: hooks registration
      // - Bits 16-31: binStep (uint16)
      // - Bits 32-255: unused
      // binStep = (parameters >> 16) & 0xFFFF
      
      // Convert parameters to BigInt for bit operations
      const paramsBigInt = BigInt(parameters);
      
      // Right shift 16 bits and mask with 0xFFFF
      const binStep = Number((paramsBigInt >> 16n) & 0xFFFFn);
      
      return binStep;
    } catch (error) {
      return 1;
    }
  }

  async queryPool(poolId, network) {
    const networkConfig = NETWORKS[network];
    if (!networkConfig || !networkConfig.dex.pancakeV4Bin) {
      throw new Error(`PancakeSwap V4 Bin not supported on ${network}`);
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    const poolManager = new ethers.Contract(
      networkConfig.dex.pancakeV4Bin.poolManager,
      PANCAKE_BIN_POOL_MANAGER_ABI,
      provider
    );

    try {
      const poolKey = await poolManager.poolIdToPoolKey(poolId);
      
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      if (poolKey.currency0 === zeroAddress && poolKey.currency1 === zeroAddress) {
        return null;
      }

      const [slot0, token0Info, token1Info] = await Promise.all([
        poolManager.getSlot0(poolId),
        this.getTokenInfo(poolKey.currency0, provider),
        this.getTokenInfo(poolKey.currency1, provider)
      ]);

      const binStep = this.extractBinStep(poolKey.parameters);
      const price = this.calculateBinPrice(slot0.activeId, binStep);

      return {
        network: networkConfig.name,
        dex: 'PancakeSwap V4 Bin',
        poolType: 'Bin',
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
        tickSpacing: binStep,  // Unified naming with CL pools
        binStep: binStep,      // Keep for backward compatibility
        hooks: poolKey.hooks,
        parameters: poolKey.parameters,
        state: {
          activeId: Number(slot0.activeId),
          lpFee: Number(slot0.lpFee),
          protocolFee: Number(slot0.protocolFee),
          price: price,
          priceFormatted: price.toExponential(6)
        },
        contracts: {
          poolManager: networkConfig.dex.pancakeV4Bin.poolManager
        },
        explorer: `${networkConfig.explorer}/address/${poolKey.currency0}`
      };

    } catch (error) {
      throw new Error(`Failed to query PancakeSwap V4 Bin pool: ${error.message}`);
    }
  }

  async queryPoolAcrossNetworks(poolId) {
    for (const [key, network] of Object.entries(NETWORKS)) {
      if (network.dex.pancakeV4Bin) {
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

module.exports = new PancakeV4BinService();
