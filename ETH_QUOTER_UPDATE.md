# Ethereum Uniswap V4 Quoter Contract Update

## Summary
Updated the evm-dex-pool-query project to support the new Ethereum Uniswap V4 quoter contract with enhanced functionality for querying pool reserves.

## Changes Made

### 1. Added New ETH-Specific Quoter ABI (`config/abis.js`)
- Added `QUOTER_ETH_ABI` constant with the new Ethereum quoter contract ABI
- Includes `getPoolKey()` function for retrieving pool configuration
- Includes `getUniswapV4PoolReserve()` function for querying pool reserves directly

### 2. Updated Uniswap V4 Service (`services/uniswapV4Service.js`)
- Modified `queryPool()` method to detect Ethereum network and use appropriate ABI
- Added logic to call `getUniswapV4PoolReserve()` when querying ETH pools
- Enhanced response to include reserve0 and reserve1 data for Ethereum pools

## Key Features

### New Functionality
The new ETH quoter contract provides:
- **getPoolKey(bytes32 poolId)**: Retrieves pool configuration
- **getUniswapV4PoolReserve(PoolKey poolKey)**: Returns reserve0 and reserve1 amounts directly

### Response Enhancement
When querying Ethereum Uniswap V4 pools, the response now includes:
```json
{
  "state": {
    "sqrtPriceX96": "...",
    "tick": 0,
    "liquidity": "...",
    "lpFee": 0,
    "protocolFee": 0,
    "price": 0.0,
    "priceFormatted": "0.000000e+0",
    "reserve0": "1000000000000000000",
    "reserve1": "2000000000000000000"
  }
}
```

## Reference
Updates based on gmgn-go-common repository:
- Source: `/Users/wmh/workspaces/bu/gmgn-go-common/contracts/uniswap/uniswap_v4_eth/quoter_eth.json`
- Contract includes support for multiple pool types (V2, V3, V4)
- Unified quoter interface for cross-DEX operations

## Testing
A test script has been created: `test_eth_v4.js`
Run with: `node test_eth_v4.js`

## Backward Compatibility
- Changes are backward compatible with existing BSC, Base, and Monad networks
- Only Ethereum network uses the new quoter ABI
- All other networks continue using the standard QUOTER_V2_ABI

## Network Configuration
Current Ethereum Uniswap V4 configuration:
```javascript
ETH: {
  uniswapV4: {
    poolManager: '0x000000000004444c5dc75cB358380D2e3dE08A90',
    quoterV2: '0x210e55C38c8D3E2803B9bFE37DFD3158e6f8e0f9',
    stateView: '0x7ffe42c4a5deea5b0fec41c94c136cf115597227'
  }
}
```
