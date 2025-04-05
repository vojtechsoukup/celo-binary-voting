const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');

require('dotenv').config();

const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
const kit = ContractKit.newKitFromWeb3(web3);

// Add account from private key
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
kit.addAccount(account.privateKey);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    alfajores: {
      provider: kit.web3.currentProvider,
      network_id: 44787,
      gas: 8000000,
      gasPrice: 10000000000
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
