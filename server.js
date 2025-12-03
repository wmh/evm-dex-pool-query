const express = require('express');
const cors = require('cors');
const path = require('path');
const poolRoutes = require('./routes/poolRoutes');

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', poolRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║          DEX Pool Query API Server                        ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:${PORT}
📚 API Documentation:

  GET  /api/supported
       → Get supported networks and DEXs

  GET  /api/pool/:dex/:poolId
       → Query pool across all networks
       → DEX: uniswapv4, pancakev4
       → Example: /api/pool/uniswapv4/0x...

  GET  /api/pool/:dex/:network/:poolId
       → Query pool on specific network
       → Network: BASE, BSC, ETH
       → Example: /api/pool/uniswapv4/BASE/0x...

  GET  /health
       → Health check

🌐 Supported Networks:
   • Base (Uniswap V4)
   • BSC (Uniswap V4, PancakeSwap V4)
   • Ethereum (Uniswap V4)

Press Ctrl+C to stop
  `);
});

module.exports = app;
