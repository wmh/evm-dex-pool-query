# Changelog

All notable changes to EVM DEX Pool Query will be documented in this file.

## Version 2.0.0 - 2024-12-03

### 🎉 Major Updates

#### New DEX Protocol Support
- ✅ **Uniswap V3** - Full support for Ethereum, BSC, and Base networks
- ✅ **PancakeSwap V3** - Support for BSC network
- ✅ **PancakeSwap V4 Concentrated Liquidity (CL)** - Separated from Bin pools
- ✅ **PancakeSwap V4 Bin** - Dedicated support for Bin pool type

### 🔧 Breaking Changes

#### API Endpoints
- **Changed**: `pancakev4` → `pancakev4cl` and `pancakev4bin`
  - Old: `/api/pool/pancakev4/...`
  - New CL: `/api/pool/pancakev4cl/...`
  - New Bin: `/api/pool/pancakev4bin/...`

#### Supported DEXs
Previous:
```
- uniswapv4
- pancakev4
```

Now:
```
- uniswapv4
- uniswapv3
- pancakev4cl
- pancakev4bin
- pancakev3
```

### 📊 Protocol Details

#### Uniswap V3
- **Networks**: Ethereum, BSC, Base
- **Pool Type**: Concentrated Liquidity (V3)
- **Query By**: Pool Address
- **Features**: Tick-based liquidity, multiple fee tiers

#### PancakeSwap V3
- **Networks**: BSC
- **Pool Type**: Concentrated Liquidity (V3)
- **Query By**: Pool Address
- **Compatible with**: Uniswap V3 interface

#### PancakeSwap V4 CL
- **Networks**: BSC, Base
- **Pool Type**: Concentrated Liquidity
- **Query By**: Pool ID (32 bytes hash)
- **Features**: Hooks, dynamic fees

#### PancakeSwap V4 Bin
- **Networks**: BSC, Base
- **Pool Type**: Bin-based Liquidity
- **Query By**: Pool ID (32 bytes hash)
- **Features**: Discrete price bins, bin step configuration

### 🆕 New Features

1. **Differentiated Pool Types**
   - CL (Concentrated Liquidity) pools
   - Bin pools with activeId tracking

2. **Enhanced Price Calculation**
   - V3 pools: sqrtPriceX96 based
   - Bin pools: Bin step formula based

3. **Additional Pool Information**
   - Observation data for V3 pools
   - Bin step for Bin pools
   - Pool type indicators

### 📝 Contract Addresses

#### PancakeSwap V4 (BSC & Base)
```
CL Pool Manager:  0xa0ffb9c1ce1fe56963b0321b32e7a0302114058b
Bin Pool Manager: 0xc697d2898e0d09264376196696c51d7abbbaa4a9
CL Quoter:        0xd0737c9762912dd34c3271197e362aa736df0926
Bin Quoter:       0xc631f4b0fc2dd68ad45f74b2942628db117dd359
```

#### Uniswap V3
```
Ethereum Factory: 0x1F98431c8aD98523631AE4a59f267346ea31F984
BSC Factory:      0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7
Base Factory:     0x33128a8fC17869897dcE68Ed026d694621f6FDfD
```

#### PancakeSwap V3
```
BSC Factory:      0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865
```

### 🔗 Example Usage

#### Query Uniswap V3 Pool
```bash
curl "http://localhost:3333/api/pool/uniswapv3/ETH/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
```

#### Query PancakeSwap V3 Pool
```bash
curl "http://localhost:3333/api/pool/pancakev3/BSC/0x36696169C63e42cd08ce11f5deeBbCeBae652050"
```

#### Query PancakeSwap V4 CL Pool
```bash
curl "http://localhost:3333/api/pool/pancakev4cl/BSC/0x08326398e0b450ac9b8f7e75d9f9073fcac013b04656ee7bc11fed6b6f8f7ff9"
```

### 🧪 Testing

New test file: `test_all_dex.js`
```bash
node test_all_dex.js
```

Tests all supported protocols:
- ✅ Uniswap V4
- ✅ Uniswap V3
- ✅ PancakeSwap V4 CL
- ✅ PancakeSwap V4 Bin
- ✅ PancakeSwap V3

### 📚 Documentation Updates

- Updated README with all protocols
- Added CHANGELOG (this file)
- Enhanced API examples
- Updated Web UI with protocol selection

### 🎯 Migration Guide

If you were using `pancakev4`:

**Before:**
```javascript
// Old way
const result = await fetch('/api/pool/pancakev4/BSC/0x...');
```

**After:**
```javascript
// New way - specify pool type
const clResult = await fetch('/api/pool/pancakev4cl/BSC/0x...');
const binResult = await fetch('/api/pool/pancakev4bin/BSC/0x...');
```

### 🐛 Bug Fixes

- Fixed network detection for multiple DEX protocols
- Improved error handling for unsupported networks
- Enhanced token decimals handling

### 🔮 What's Next

Future enhancements planned:
- [ ] Uniswap V2 support
- [ ] SushiSwap support
- [ ] Historical data queries
- [ ] Swap simulation
- [ ] Position tracking

---

## Version 1.0.0 - Initial Release

- Uniswap V4 support
- PancakeSwap V4 support (unified)
- Web UI
- REST API
- Multi-network support
