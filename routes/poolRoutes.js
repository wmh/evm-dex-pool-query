const express = require('express');
const router = express.Router();
const uniswapV2Service = require('../services/uniswapV2Service');
const uniswapV4Service = require('../services/uniswapV4Service');
const uniswapV3Service = require('../services/uniswapV3Service');
const pancakeV4CLService = require('../services/pancakeV4CLService');
const pancakeV4BinService = require('../services/pancakeV4BinService');
const pancakeV3Service = require('../services/pancakeV3Service');
const { NETWORKS } = require('../config/networks');

// Get pool info by DEX type and pool ID
router.get('/pool/:dex/:network/:poolId', async (req, res) => {
  try {
    const { dex, network, poolId } = req.params;
    
    const networkKey = network.toUpperCase();
    if (!NETWORKS[networkKey]) {
      return res.status(400).json({ 
        error: 'Invalid network', 
        availableNetworks: Object.keys(NETWORKS) 
      });
    }

    let result;
    switch (dex.toLowerCase()) {
      case 'v2':
        // Query Uniswap V2 / PancakeSwap V2 (they use same interface)
        result = await uniswapV2Service.queryPool(poolId, networkKey);
        if (!result) {
          throw new Error('Pool not found in V2');
        }
        break;
      case 'v3':
        // Try both Uniswap V3 and PancakeSwap V3
        try {
          result = await uniswapV3Service.queryPool(poolId, networkKey);
        } catch (error) {
          try {
            result = await pancakeV3Service.queryPool(poolId, networkKey);
          } catch (error2) {
            throw new Error('Pool not found in V3');
          }
        }
        break;
      case 'uniswapv4':
      case 'univ4':
        result = await uniswapV4Service.queryPool(poolId, networkKey);
        break;
      case 'uniswapv3':
      case 'univ3':
        result = await uniswapV3Service.queryPool(poolId, networkKey);
        break;
      case 'pancakev4cl':
      case 'pancakev4-cl':
        result = await pancakeV4CLService.queryPool(poolId, networkKey);
        break;
      case 'pancakev4bin':
      case 'pancakev4-bin':
        result = await pancakeV4BinService.queryPool(poolId, networkKey);
        break;
      case 'pancakev3':
        result = await pancakeV3Service.queryPool(poolId, networkKey);
        break;
      default:
        return res.status(400).json({ 
          error: 'Unsupported DEX', 
          supportedDEXs: ['v2', 'v3', 'uniswapv4', 'uniswapv3', 'pancakev4cl', 'pancakev4bin', 'pancakev3'] 
        });
    }

    if (!result) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-detect network for a pool ID
router.get('/pool/:dex/:poolId', async (req, res) => {
  try {
    const { dex, poolId } = req.params;

    let result;
    switch (dex.toLowerCase()) {
      case 'v2':
        // Query V2 across networks
        result = await uniswapV2Service.queryPoolAcrossNetworks(poolId);
        if (!result) {
          return res.status(404).json({ error: 'Pool not found in V2' });
        }
        break;
      case 'v3':
        // Try both across networks
        result = await uniswapV3Service.queryPoolAcrossNetworks(poolId);
        if (!result) {
          result = await pancakeV3Service.queryPoolAcrossNetworks(poolId);
        }
        if (!result) {
          return res.status(404).json({ error: 'Pool not found in V3' });
        }
        break;
      case 'uniswapv4':
      case 'univ4':
        result = await uniswapV4Service.queryPoolAcrossNetworks(poolId);
        break;
      case 'uniswapv3':
      case 'univ3':
        result = await uniswapV3Service.queryPoolAcrossNetworks(poolId);
        break;
      case 'pancakev4cl':
      case 'pancakev4-cl':
        result = await pancakeV4CLService.queryPoolAcrossNetworks(poolId);
        break;
      case 'pancakev4bin':
      case 'pancakev4-bin':
        result = await pancakeV4BinService.queryPoolAcrossNetworks(poolId);
        break;
      case 'pancakev3':
        result = await pancakeV3Service.queryPoolAcrossNetworks(poolId);
        break;
      default:
        return res.status(400).json({ 
          error: 'Unsupported DEX', 
          supportedDEXs: ['v2', 'v3', 'uniswapv4', 'uniswapv3', 'pancakev4cl', 'pancakev4bin', 'pancakev3'] 
        });
    }

    if (!result) {
      return res.status(404).json({ error: 'Pool not found on any supported network' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported networks and DEXs
router.get('/supported', (req, res) => {
  const supported = {};
  
  for (const [key, network] of Object.entries(NETWORKS)) {
    supported[key] = {
      name: network.name,
      chainId: network.chainId,
      dex: Object.keys(network.dex)
    };
  }

  res.json({
    networks: supported,
    supportedDEXs: [
      'v2',
      'v3',
      'uniswapv4',
      'uniswapv3', 
      'pancakev4cl',
      'pancakev4bin',
      'pancakev3'
    ]
  });
});

module.exports = router;
