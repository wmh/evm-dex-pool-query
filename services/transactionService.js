const { ethers } = require('ethers');
const { NETWORKS } = require('../config/networks');

class TransactionService {
  /**
   * Get transaction details and attempt to extract pool information
   * @param {string} txHash - Transaction hash
   * @param {string} network - Network key (e.g., 'MONAD', 'BSC', 'ETH')
   * @returns {Object} Transaction details with pool info if available
   */
  async getTransaction(txHash, network) {
    const networkConfig = NETWORKS[network];
    if (!networkConfig) {
      throw new Error(`Network ${network} not supported`);
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpc);
    
    try {
      // Get transaction
      const tx = await provider.getTransaction(txHash);
      
      if (!tx) {
        throw new Error(`Transaction ${txHash} not found on ${network}`);
      }

      // Get transaction receipt for more details
      const receipt = await provider.getTransactionReceipt(txHash);

      return {
        network: networkConfig.name,
        chainId: networkConfig.chainId,
        transaction: {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          gasLimit: tx.gasLimit.toString(),
          gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : null,
          nonce: tx.nonce,
          data: tx.data,
          blockNumber: tx.blockNumber,
          blockHash: tx.blockHash
        },
        receipt: receipt ? {
          status: receipt.status,
          gasUsed: receipt.gasUsed.toString(),
          effectiveGasPrice: ethers.formatUnits(receipt.gasPrice || receipt.effectiveGasPrice, 'gwei'),
          logs: receipt.logs.length,
          contractAddress: receipt.contractAddress
        } : null
      };
    } catch (error) {
      throw new Error(`Failed to get transaction on ${network}: ${error.message}`);
    }
  }

  /**
   * Try to get transaction across all networks
   * @param {string} txHash - Transaction hash
   * @returns {Object} Transaction details from first network where found
   */
  async getTransactionAcrossNetworks(txHash) {
    for (const [networkKey, networkConfig] of Object.entries(NETWORKS)) {
      try {
        const result = await this.getTransaction(txHash, networkKey);
        if (result) {
          return result;
        }
      } catch (error) {
        // Continue to next network
        continue;
      }
    }
    
    throw new Error(`Transaction ${txHash} not found on any supported network`);
  }

  /**
   * Check if a string is a transaction hash (vs pool ID)
   * @param {string} value - Value to check
   * @returns {boolean} True if looks like a transaction hash
   */
  isTransactionHash(value) {
    return value && value.startsWith('0x') && value.length === 66 && !ethers.isAddress(value);
  }
}

module.exports = new TransactionService();
