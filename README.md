# 🔍 EVM DEX Pool Query

> A comprehensive web application to query liquidity pool information from multiple DEX protocols across EVM-compatible networks (Ethereum, BSC, Base).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

Query real-time liquidity pool data from **Uniswap V2/V3/V4** and **PancakeSwap V3/V4** with a beautiful web interface and RESTful API.

## Features

- 🔍 Query pool information by Pool ID or Address
- 🌐 Multi-network support (Base, BSC, Ethereum)
- 🔄 Auto-detect network functionality
- 💱 Support for 5+ DEX protocols:
  - **Uniswap V4** - Latest hooks-based protocol
  - **Uniswap V3** - Concentrated liquidity
  - **PancakeSwap V4 CL** - Concentrated liquidity with hooks
  - **PancakeSwap V4 Bin** - Bin-based liquidity
  - **PancakeSwap V3** - Concentrated liquidity
- 📊 Real-time pool state (liquidity, price, tick/bin)
- 🎨 Beautiful web interface

## Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone git@github.com:wmh/evm-dex-pool-query.git
cd evm-dex-pool-query

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3333`

### Development Mode

```bash
# Auto-restart on file changes
npm run dev
```

### Run Tests

```bash
npm test
```

## API Endpoints

### Get Supported Networks and DEXs

```
GET /api/supported
```

### Query Pool (Auto-detect Network)

```
GET /api/pool/:dex/:poolId
```

Example:
```
GET /api/pool/uniswapv4/0xa1e7d3925f6603ec872cadbb151ddd0cbe6749ee5a7ac62de8ae346ac4179efd
```

### Query Pool (Specific Network)

```
GET /api/pool/:dex/:network/:poolId
```

Example:
```
GET /api/pool/uniswapv4/BASE/0xa1e7d3925f6603ec872cadbb151ddd0cbe6749ee5a7ac62de8ae346ac4179efd
```

Parameters:
- `dex`: `uniswapv4` or `pancakev4`
- `network`: `BASE`, `BSC`, or `ETH`
- `poolId`: Pool ID (32 bytes hex string)

## Response Format

```json
{
  "network": "Base",
  "dex": "Uniswap V4",
  "poolId": "0x...",
  "token0": {
    "address": "0x...",
    "symbol": "USDC",
    "name": "USD Coin",
    "decimals": 6
  },
  "token1": {
    "address": "0x...",
    "symbol": "WETH",
    "name": "Wrapped Ether",
    "decimals": 18
  },
  "fee": 3000,
  "feePercent": 0.3,
  "tickSpacing": 60,
  "hooks": "0x...",
  "state": {
    "sqrtPriceX96": "...",
    "tick": 12345,
    "liquidity": "...",
    "lpFee": 3000,
    "protocolFee": 0,
    "price": 0.000123,
    "priceFormatted": "1.234567e-4"
  },
  "contracts": {
    "poolManager": "0x...",
    "quoterV2": "0x...",
    "stateView": "0x..."
  },
  "explorer": "https://basescan.org/address/0x..."
}
```

## Supported Networks and Protocols

### Base (Chain ID: 8453)
- ✅ Uniswap V4
- ✅ Uniswap V3
- ✅ PancakeSwap V4 CL
- ✅ PancakeSwap V4 Bin

### BSC - Binance Smart Chain (Chain ID: 56)
- ✅ Uniswap V4
- ✅ Uniswap V3
- ✅ PancakeSwap V3
- ✅ PancakeSwap V4 CL
- ✅ PancakeSwap V4 Bin

### Ethereum (Chain ID: 1)
- ✅ Uniswap V4
- ✅ Uniswap V3

## Example Pool IDs / Addresses

### Uniswap
- **V2** (BSC): `0x4351190e37788312036f29fb49d2bb985b0bb126`
- **V3** (ETH): `0x5ecebf93f9235347c4f44d4be56c46eef67b8279`
- **V4** (BSC): `0x73b41de853cdbaaa9b536f6b0d6b787d753c17af7bf34a13f59b0396fe874d82`

### PancakeSwap
- **V4 CL** (BSC): `0x48130f6eedfe2a3bad65fd0fd2987c2ca5317da9f054a9bcbfbd51cf26a140f8`
- **V4 Bin** (BSC): `0xb7dcd468ba90891583f5485e209d4334c79e2c017c836aa46209565b406fcde`

## Architecture

```
evm-dex-pool-query/
├── config/
│   ├── networks.js    # Network configurations
│   └── abis.js        # Smart contract ABIs
├── services/
│   ├── uniswapV4Service.js    # Uniswap V4 logic
│   └── pancakeV4Service.js    # PancakeSwap V4 logic
├── routes/
│   └── poolRoutes.js  # API routes
├── public/
│   └── index.html     # Web interface
├── server.js          # Express server
└── package.json
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Blockchain**: ethers.js v6
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid DEX or network)
- `404`: Pool not found
- `500`: Server error

## Future Enhancements

- [ ] Support for more DEX protocols (Uniswap V2, V3, SushiSwap, etc.)
- [ ] Historical pool data
- [ ] Price charts
- [ ] Position tracking
- [ ] Swap simulations
- [ ] WebSocket support for real-time updates

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
