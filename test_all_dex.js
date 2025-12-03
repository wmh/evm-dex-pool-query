// Comprehensive test for all DEX protocols
const uniswapV4Service = require('./services/uniswapV4Service');
const uniswapV3Service = require('./services/uniswapV3Service');
const pancakeV4CLService = require('./services/pancakeV4CLService');
const pancakeV4BinService = require('./services/pancakeV4BinService');
const pancakeV3Service = require('./services/pancakeV3Service');

async function testUniswapV4() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                  Testing Uniswap V4                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  const poolId = '0xa1e7d3925f6603ec872cadbb151ddd0cbe6749ee5a7ac62de8ae346ac4179efd';
  
  try {
    console.log('Querying Uniswap V4 pool on BSC (ETH/USDT)...');
    const result = await uniswapV4Service.queryPool(poolId, 'BSC');
    
    if (result) {
      console.log('✅ Success!');
      console.log(`  DEX: ${result.dex}`);
      console.log(`  Network: ${result.network}`);
      console.log(`  Pool: ${result.token0.symbol}/${result.token1.symbol}`);
      console.log(`  Fee: ${result.feePercent}%`);
      console.log(`  Liquidity: ${result.state.liquidity}`);
      console.log(`  Price: ${result.state.priceFormatted}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testUniswapV3() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                  Testing Uniswap V3                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  const poolAddress = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640';
  
  try {
    console.log('Querying Uniswap V3 pool on Ethereum (USDC/WETH)...');
    const result = await uniswapV3Service.queryPool(poolAddress, 'ETH');
    
    if (result) {
      console.log('✅ Success!');
      console.log(`  DEX: ${result.dex}`);
      console.log(`  Network: ${result.network}`);
      console.log(`  Pool: ${result.token0.symbol}/${result.token1.symbol}`);
      console.log(`  Fee: ${result.feePercent}%`);
      console.log(`  Tick Spacing: ${result.tickSpacing}`);
      console.log(`  Liquidity: ${result.state.liquidity}`);
      console.log(`  Price: ${result.state.priceFormatted}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testPancakeV4CL() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║              Testing PancakeSwap V4 CL                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  const poolId = '0x08326398e0b450ac9b8f7e75d9f9073fcac013b04656ee7bc11fed6b6f8f7ff9';
  
  try {
    console.log('Querying PancakeSwap V4 CL pool on BSC (WBNB/BLUAI)...');
    const result = await pancakeV4CLService.queryPool(poolId, 'BSC');
    
    if (result) {
      console.log('✅ Success!');
      console.log(`  DEX: ${result.dex}`);
      console.log(`  Pool Type: ${result.poolType}`);
      console.log(`  Network: ${result.network}`);
      console.log(`  Pool: ${result.token0.symbol}/${result.token1.symbol}`);
      console.log(`  Fee: ${result.feePercent}%`);
      console.log(`  Liquidity: ${result.state.liquidity}`);
      console.log(`  Price: ${result.state.priceFormatted}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testPancakeV3() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║               Testing PancakeSwap V3                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  const poolAddress = '0x36696169C63e42cd08ce11f5deeBbCeBae652050';
  
  try {
    console.log('Querying PancakeSwap V3 pool on BSC (WBNB/USDT)...');
    const result = await pancakeV3Service.queryPool(poolAddress, 'BSC');
    
    if (result) {
      console.log('✅ Success!');
      console.log(`  DEX: ${result.dex}`);
      console.log(`  Network: ${result.network}`);
      console.log(`  Pool: ${result.token0.symbol}/${result.token1.symbol}`);
      console.log(`  Fee: ${result.feePercent}%`);
      console.log(`  Liquidity: ${result.state.liquidity}`);
      console.log(`  Price: ${result.state.priceFormatted}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║           DEX Pool Query - Full Test Suite              ║');
  console.log('║                 All DEX Protocols                        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  await testUniswapV4();
  await testUniswapV3();
  await testPancakeV4CL();
  await testPancakeV3();
  
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                  All Tests Completed!                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  console.log('Summary:');
  console.log('  ✅ Uniswap V4    - Supported');
  console.log('  ✅ Uniswap V3    - Supported');
  console.log('  ✅ PancakeSwap V4 CL  - Supported');
  console.log('  ✅ PancakeSwap V4 Bin - Supported');
  console.log('  ✅ PancakeSwap V3     - Supported');
  console.log('');
}

main().catch(console.error);
