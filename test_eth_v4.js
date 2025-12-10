// Test ETH Uniswap V4 with new quoter contract
const uniswapV4Service = require('./services/uniswapV4Service');

async function testEthV4() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         Testing Ethereum Uniswap V4 (New Quoter)        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  // Example ETH V4 pool ID (you may need to replace with an actual pool)
  const poolId = '0x0000000000000000000000000000000000000000000000000000000000000000';
  
  try {
    console.log('Querying Uniswap V4 pool on Ethereum...');
    const result = await uniswapV4Service.queryPool(poolId, 'ETH');
    
    if (result) {
      console.log('✅ Success!');
      console.log(`  DEX: ${result.dex}`);
      console.log(`  Network: ${result.network}`);
      console.log(`  Pool: ${result.token0.symbol}/${result.token1.symbol}`);
      console.log(`  Fee: ${result.feePercent}%`);
      console.log(`  Liquidity: ${result.state.liquidity}`);
      console.log(`  Price: ${result.state.priceFormatted}`);
      if (result.state.reserve0) {
        console.log(`  Reserve0: ${result.state.reserve0}`);
        console.log(`  Reserve1: ${result.state.reserve1}`);
      }
    } else {
      console.log('⚠️  Pool not found or empty');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                   Test Completed!                        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
}

testEthV4().catch(console.error);
