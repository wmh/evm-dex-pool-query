// Network configurations for different chains
const NETWORKS = {
  BASE: {
    name: 'Base',
    chainId: 8453,
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    dex: {
      uniswapV4: {
        poolManager: '0x7c5f5a4bbd8fd63184577525326123b519429bdc',
        quoterV2: '0xe4eE68bb833EB2C0D6AaE778F3Ce9dE72008ac97',
        stateView: '0xA3c0c9b65baD0b08107Aa264b0f3dB444b867A71'
      },
      uniswapV3: {
        factory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
        quoter: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a'
      },
      pancakeV4CL: {
        poolManager: '0xa0ffb9c1ce1fe56963b0321b32e7a0302114058b',
        quoter: '0xd0737c9762912dd34c3271197e362aa736df0926'
      },
      pancakeV4Bin: {
        poolManager: '0xc697d2898e0d09264376196696c51d7abbbaa4a9',
        quoter: '0xc631f4b0fc2dd68ad45f74b2942628db117dd359'
      }
    }
  },
  BSC: {
    name: 'BSC',
    chainId: 56,
    rpc: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com',
    dex: {
      uniswapV4: {
        poolManager: '0x28e2ea090877bf75740558f6bfb36a5ffee9e9df',
        quoterV2: '0xEDA83eA10F9020FB208E48a5A9c02ef7e7135Ebf',
        stateView: '0xd13Dd3D6E93f276FAfc9Db9E6BB47C1180aeE0c4'
      },
      uniswapV3: {
        factory: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
        quoter: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997'
      },
      pancakeV3: {
        factory: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
        quoter: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997'
      },
      pancakeV4CL: {
        poolManager: '0xa0ffb9c1ce1fe56963b0321b32e7a0302114058b',
        quoter: '0xd0737c9762912dd34c3271197e362aa736df0926'
      },
      pancakeV4Bin: {
        poolManager: '0xc697d2898e0d09264376196696c51d7abbbaa4a9',
        quoter: '0xc631f4b0fc2dd68ad45f74b2942628db117dd359'
      }
    }
  },
  ETH: {
    name: 'Ethereum',
    chainId: 1,
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    dex: {
      uniswapV4: {
        poolManager: '0x000000000004444c5dc75cB358380D2e3dE08A90',
        quoterV2: '0x210e55C38c8D3E2803B9bFE37DFD3158e6f8e0f9',
        stateView: '0x7ffe42c4a5deea5b0fec41c94c136cf115597227'
      },
      uniswapV3: {
        factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
      }
    }
  },
  MONAD: {
    name: 'Monad',
    chainId: 143,
    rpc: 'https://rpc1.monad.xyz',
    explorer: 'https://monadvision.com',
    dex: {
      uniswapV2: {
        factory: '0x182a927119d56008d921126764bf884221b10f59'
      },
      uniswapV3: {
        factory: '0x204faca1764b154221e35c0d20abb3c525710498',
        quoter: '0x0393c0Bc9Fa2b8307396a565C5B14C4Ee285A11f'
      },
      uniswapV4: {
        poolManager: '0x188d586ddcf52439676ca21a244753fa19f9ea8e',
        quoterV2: '0x0393c0Bc9Fa2b8307396a565C5B14C4Ee285A11f',
        stateView: '0x77395f3b2e73ae90843717371294fa97cc419d64'
      },
      pancakeV2: {
        factory: '0x02a84c1b3bbd7401a5f7fa98a384ebc70bb5749e'
      },
      pancakeV3: {
        factory: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
        quoter: '0x0393c0Bc9Fa2b8307396a565C5B14C4Ee285A11f'
      }
    }
  }
};

module.exports = { NETWORKS };
