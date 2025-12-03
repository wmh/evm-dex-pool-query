// Simplified ABIs for pool queries

const POOL_MANAGER_ABI = [
  {
    "inputs": [{"internalType": "bytes25", "name": "poolId", "type": "bytes25"}],
    "name": "poolKeys",
    "outputs": [
      {"internalType": "Currency", "name": "currency0", "type": "address"},
      {"internalType": "Currency", "name": "currency1", "type": "address"},
      {"internalType": "uint24", "name": "fee", "type": "uint24"},
      {"internalType": "int24", "name": "tickSpacing", "type": "int24"},
      {"internalType": "contract IHooks", "name": "hooks", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const QUOTER_V2_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "poolId", "type": "bytes32"}],
    "name": "getPoolKey",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "currency0", "type": "address"},
          {"internalType": "address", "name": "currency1", "type": "address"},
          {"internalType": "uint24", "name": "fee", "type": "uint24"},
          {"internalType": "int24", "name": "tickSpacing", "type": "int24"},
          {"internalType": "address", "name": "hooks", "type": "address"}
        ],
        "internalType": "struct PoolKey",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const STATE_VIEW_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "poolId", "type": "bytes32"}],
    "name": "getSlot0",
    "outputs": [
      {
        "components": [
          {"internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160"},
          {"internalType": "int24", "name": "tick", "type": "int24"},
          {"internalType": "uint24", "name": "protocolFee", "type": "uint24"},
          {"internalType": "uint24", "name": "lpFee", "type": "uint24"}
        ],
        "internalType": "struct IPoolManager.Slot0",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "poolId", "type": "bytes32"}],
    "name": "getLiquidity",
    "outputs": [{"internalType": "uint128", "name": "", "type": "uint128"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const PANCAKE_CL_POOL_MANAGER_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "id", "type": "bytes32"}],
    "name": "poolIdToPoolKey",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "currency0", "type": "address"},
          {"internalType": "address", "name": "currency1", "type": "address"},
          {"internalType": "address", "name": "hooks", "type": "address"},
          {"internalType": "address", "name": "poolManager", "type": "address"},
          {"internalType": "uint24", "name": "fee", "type": "uint24"},
          {"internalType": "bytes32", "name": "parameters", "type": "bytes32"}
        ],
        "internalType": "struct PoolKey",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "poolId", "type": "bytes32"}],
    "name": "getSlot0",
    "outputs": [
      {
        "components": [
          {"internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160"},
          {"internalType": "int24", "name": "tick", "type": "int24"},
          {"internalType": "uint24", "name": "protocolFee", "type": "uint24"},
          {"internalType": "uint24", "name": "lpFee", "type": "uint24"}
        ],
        "internalType": "struct Slot0",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "poolId", "type": "bytes32"}],
    "name": "getLiquidity",
    "outputs": [{"internalType": "uint128", "name": "", "type": "uint128"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const PANCAKE_BIN_POOL_MANAGER_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "poolId", "type": "bytes32"}],
    "name": "getSlot0",
    "outputs": [
      {
        "components": [
          {"internalType": "uint24", "name": "activeId", "type": "uint24"},
          {"internalType": "uint24", "name": "protocolFee", "type": "uint24"},
          {"internalType": "uint24", "name": "lpFee", "type": "uint24"}
        ],
        "internalType": "struct Slot0",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "id", "type": "bytes32"}],
    "name": "poolIdToPoolKey",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "currency0", "type": "address"},
          {"internalType": "address", "name": "currency1", "type": "address"},
          {"internalType": "address", "name": "hooks", "type": "address"},
          {"internalType": "address", "name": "poolManager", "type": "address"},
          {"internalType": "uint24", "name": "fee", "type": "uint24"},
          {"internalType": "bytes32", "name": "parameters", "type": "bytes32"}
        ],
        "internalType": "struct PoolKey",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const UNISWAP_V3_POOL_ABI = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function fee() view returns (uint24)",
  "function tickSpacing() view returns (int24)",
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function liquidity() view returns (uint128)"
];

const UNISWAP_V3_FACTORY_ABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)"
];

const ERC20_ABI = [
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function decimals() view returns (uint8)"
];

module.exports = {
  POOL_MANAGER_ABI,
  QUOTER_V2_ABI,
  STATE_VIEW_ABI,
  PANCAKE_CL_POOL_MANAGER_ABI,
  PANCAKE_BIN_POOL_MANAGER_ABI,
  UNISWAP_V3_POOL_ABI,
  UNISWAP_V3_FACTORY_ABI,
  ERC20_ABI
};
