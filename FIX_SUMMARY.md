# 修復總結 - Monad 查詢問題

## 問題描述

查詢 Monad 交易哈希 `0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e` 時出現錯誤：
```
invalid value for Contract target
```

## 根本原因分析

1. **交易不存在**
   - 此交易哈希在 Monad 網絡上不存在
   - RPC 返回 `null`

2. **輸入類型混淆**
   - 交易哈希 (Transaction Hash) 和 Pool ID 都是 32 字節 (66 字符含 0x)
   - 用戶將交易哈希當作 Pool ID 使用
   - ethers.js 在嘗試創建合約實例時拋出 "invalid value for Contract target" 錯誤

3. **配置缺失**
   - Monad 的 Uniswap V4 配置缺少 `quoterV2` 地址
   - 無法正確查詢 pool 信息

## 解決方案

### 1. 新增交易服務 (`services/transactionService.js`)

**功能：**
- 檢測輸入是否為交易哈希
- 跨網絡查詢交易詳情
- 提供清晰的錯誤提示

**核心方法：**
```javascript
isTransactionHash(value)  // 判斷是否為交易哈希
getTransaction(txHash, network)  // 查詢特定網絡的交易
getTransactionAcrossNetworks(txHash)  // 跨網絡查詢
```

### 2. 更新 Monad 配置

參考 `gmgn-go-common` 倉庫的實現，添加缺失的配置：

```javascript
MONAD: {
  chainId: 143,
  rpc: 'https://rpc1.monad.xyz',
  dex: {
    uniswapV4: {
      poolManager: '0x188d586ddcf52439676ca21a244753fa19f9ea8e',
      quoterV2: '0x0393c0Bc9Fa2b8307396a565C5B14C4Ee285A11f',  // ✅ 新增
      stateView: '0x77395f3b2e73ae90843717371294fa97cc419d64'
    }
  }
}
```

### 3. 增強路由處理 (`routes/poolRoutes.js`)

**改進：**
- 自動檢測交易哈希並返回友好錯誤
- 新增交易查詢端點
- 提供使用建議

**錯誤響應示例：**
```json
{
  "error": "Invalid pool ID",
  "message": "The provided value appears to be a transaction hash, not a pool ID...",
  "hint": "Use /api/transaction/:network/:txHash to query transaction details"
}
```

### 4. 新增 API 端點

```bash
# 查詢特定網絡的交易
GET /api/transaction/:network/:txHash

# 跨網絡查詢交易
GET /api/transaction/:txHash
```

## 技術細節

### Multicall3 地址
所有支持的鏈使用統一的 Multicall3 地址：
```
0xcA11bde05977b3631167028862bE2a173976CA11
```

### Monad 關鍵合約地址
參考自 `gmgn-go-common/constant/`:

| 合約 | 地址 |
|-----|------|
| Uniswap V4 Pool Manager | `0x188d586ddcf52439676ca21a244753fa19f9ea8e` |
| Quoter | `0x0393c0Bc9Fa2b8307396a565C5B14C4Ee285A11f` |
| State View | `0x77395f3b2e73ae90843717371294fa97cc419d64` |
| Uniswap V3 Factory | `0x204faca1764b154221e35c0d20abb3c525710498` |
| PancakeSwap V3 Factory | `0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865` |
| WMON (Wrapped Monad) | `0x3bd359c1119da7da1d913d1c4d2b7c461115433a` |
| USDT | `0xe7cd86e13ac4309349f30b3435a9d337750fc82d` |
| USDC | `0x754704bc059f8c67012fed69bc8a327a5aafb603` |

## 使用示例

### 正確：查詢 Pool
```bash
# Pool ID 是 32 字節標識符
curl http://localhost:3333/api/pool/uniswapv4/MONAD/0x...poolId...
```

### 正確：查詢交易
```bash
# 使用交易端點
curl http://localhost:3333/api/transaction/MONAD/0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e
```

### 錯誤處理
```bash
# 如果誤用交易哈希作為 Pool ID
curl http://localhost:3333/api/pool/uniswapv4/MONAD/0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e

# 返回：
{
  "error": "Invalid pool ID",
  "message": "The provided value appears to be a transaction hash...",
  "hint": "Use /api/transaction/:network/:txHash to query transaction details"
}
```

## 測試驗證

```bash
# 1. 驗證配置
node -e "const {NETWORKS} = require('./config/networks'); console.log(NETWORKS.MONAD.dex.uniswapV4)"

# 2. 測試交易哈希檢測
node -e "const ts = require('./services/transactionService'); console.log(ts.isTransactionHash('0x35b6ea...'));"

# 3. 測試交易查詢
curl http://localhost:3333/api/transaction/MONAD/0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e
```

## 參考文檔

- [MONAD_FIX.md](./MONAD_FIX.md) - 詳細修復說明
- [gmgn-go-common](https://github.com/wmh/gmgn-go-common) - Go 實現參考
- README.md - 更新的 API 文檔

## 結論

✅ **問題已解決：**
1. 添加了交易哈希檢測和友好錯誤提示
2. 完善了 Monad 網絡配置
3. 新增了交易查詢功能
4. 提供了清晰的使用指南

⚠️ **注意事項：**
- 交易哈希 `0x35b6ea026cf403bcdb13afeac492de8b5b6d9d15c4435730c2e77557c094370e` 在 Monad 上不存在
- Pool ID 和交易哈希都是 32 字節，需要根據使用場景區分
- 如需從交易中提取 pool 信息，需要解析交易 logs (未實現)

## 更新文件清單

- ✅ `config/networks.js` - 添加 Monad quoterV2 配置
- ✅ `services/transactionService.js` - 新增交易服務
- ✅ `routes/poolRoutes.js` - 增強錯誤處理和新端點
- ✅ `README.md` - 更新文檔
- ✅ `MONAD_FIX.md` - 英文修復說明
- ✅ `FIX_SUMMARY.md` - 中文總結 (本文件)
