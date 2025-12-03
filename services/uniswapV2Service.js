const { ethers } = require('ethers');
const { ERC20_ABI } = require('../config/abis');
const { NETWORKS } = require('../config/networks');

// Uniswap V2 Pair ABI (minimal)
const UNISWAP_V2_PAIR_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      {"internalType": "uint112", "name": "reserve0", "type": "uint112"},
      {"internalType": "uint112", "name": "reserve1", "type": "uint112"},
      {"internalType": "uint32", "name": "blockTimestampLast", "type": "uint32"}
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "token0",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "token1",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

class UniswapV2Service {
  
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

  calculatePrice(reserve0, reserve1, decimals0, decimals1) {
    // Price of token1 in terms of token0
    // price = reserve1 / reserve0 * (10^decimals0 / 10^decimals1)
    const price = (Number(reserve1) / Number(reserve0)) * (10 ** (decimals0 - decimals1));
    return price;
  }

  async queryPool(poolAddress, network) {
    const networkConfig = NETWORKS[network];
    if (!networkConfig) {
      throw new Error(`Network ${network} not supported`);
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    const pair = new ethers.Contract(poolAddress, UNISWAP_V2_PAIR_ABI, provider);

    try {
      const [token0Address, token1Address, reserves] = await Promise.all([
        pair.token0(),
        pair.token1(),
        pair.getReserves()
      ]);

      const [token0Info, token1Info] = await Promise.all([
        this.getTokenInfo(token0Address, provider),
        this.getTokenInfo(token1Address, provider)
      ]);

      const price = this.calculatePrice(
        reserves.reserve0,
        reserves.reserve1,
        token0Info.decimals,
        token1Info.decimals
      );

      return {
        network: networkConfig.name,
        dex: 'Uniswap V2',
        poolType: 'V2',
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
        reserves: {
          reserve0: reserves.reserve0.toString(),
          reserve1: reserves.reserve1.toString(),
          blockTimestampLast: Number(reserves.blockTimestampLast)
        },
        price: price,
        priceFormatted: price.toExponential(6),
        explorer: `${networkConfig.explorer}/address/${poolAddress}`
      };

    } catch (error) {
      return null;
    }
  }

  async queryPoolAcrossNetworks(poolAddress) {
    const networks = ['ETH', 'BSC', 'BASE'];
    
    for (const network of networks) {
      try {
        const result = await this.queryPool(poolAddress, network);
        if (result) {
          return result;
        }
      } catch (error) {
        continue;
      }
    }
    
    return null;
  }
}

module.exports = new UniswapV2Service();
