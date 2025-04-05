const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');

require('dotenv').config();

// Create web3 instances for both networks
const web3Alfajores = new Web3('https://alfajores-forno.celo-testnet.org');
const web3Mainnet = new Web3('https://forno.celo.org');

// Create kit instances
const kitAlfajores = ContractKit.newKitFromWeb3(web3Alfajores);
const kitMainnet = ContractKit.newKitFromWeb3(web3Mainnet);

// Add account from private key
const account = web3Alfajores.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3Alfajores.eth.accounts.wallet.add(account);
web3Mainnet.eth.accounts.wallet.add(account);
kitAlfajores.addAccount(account.privateKey);
kitMainnet.addAccount(account.privateKey);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    alfajores: {
      provider: kitAlfajores.web3.currentProvider,
      network_id: 44787,
      gas: 4000000,
      gasPrice: 5000000000,
      from: account.address
    },
    mainnet: {
      provider: kitMainnet.web3.currentProvider,
      network_id: 42220,
      gas: 8000000,
      gasPrice: 5000000000,
      from: account.address
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
