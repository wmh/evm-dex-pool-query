# Monad Network Configuration Fix

## Issue
Transaction hash `0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e` could not be queried on Monad network.

## Root Cause
1. **Transaction Not Found**: The transaction does not exist on Monad network
2. **Invalid Input Type**: The value is a transaction hash (66 characters), not a valid pool ID or contract address (42 characters)
3. **Missing Configuration**: Monad Uniswap V4 configuration was missing the `quoterV2` address

## Solution

### 1. Added Transaction Hash Detection
Created `transactionService.js` to:
- Detect when input is a transaction hash vs pool ID
- Provide clear error messages
- Support transaction lookup across networks

### 2. Updated Monad Configuration
Added missing `quoterV2` address for Monad Uniswap V4:
```javascript
uniswapV4: {
  poolManager: '0x188d586ddcf52439676ca21a244753fa19f9ea8e',
  quoterV2: '0x0393c0Bc9Fa2b8307396a565C5B14C4Ee285A11f',  // Added
  stateView: '0x77395f3b2e73ae90843717371294fa97cc419d64'
}
```

### 3. Added New API Endpoints
- `GET /api/transaction/:network/:txHash` - Get transaction on specific network
- `GET /api/transaction/:txHash` - Get transaction across all networks

## Reference Implementation
Based on `gmgn-go-common` repository:
- Multicall3 address: `0xcA11bde05977b3631167028862bE2a173976CA11` (standard across chains)
- Monad quoter address: `0x0393c0Bc9Fa2b8307396a565C5B14C4Ee285A11f`
- State view address: `0x77395f3b2e73ae90843717371294fa97cc419d64`

## Usage Examples

### Query Pool (Correct Usage)
```bash
# Pool ID is 32 bytes (66 characters including 0x)
curl http://localhost:3333/api/pool/uniswapv4/MONAD/0x...poolId...
```

### Query Transaction
```bash
# Transaction hash is also 32 bytes but represents a transaction
curl http://localhost:3333/api/transaction/MONAD/0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e
```

### Error Handling
If you mistakenly use a transaction hash as a pool ID, you'll get:
```json
{
  "error": "Invalid pool ID",
  "message": "The provided value appears to be a transaction hash, not a pool ID...",
  "hint": "Use /api/transaction/:network/:txHash to query transaction details"
}
```

## Notes
- Transaction hash `0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e` does not exist on Monad
- If you need to find pools from transactions, you would need to parse transaction logs
- Monad uses the same Multicall3 contract as other chains: `0xcA11bde05977b3631167028862bE2a173976CA11`
