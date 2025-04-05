const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');
require('dotenv').config();

async function deployContract() {
    try {
        // Connect to the network
        const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
        const kit = ContractKit.newKitFromWeb3(web3);

        // Add account
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        kit.connection.addAccount(account.privateKey);
        
        // Get the contract artifacts
        const BinaryVoting = require('../build/contracts/BinaryVoting.json');
        
        // Create contract instance
        const contract = new kit.connection.web3.eth.Contract(BinaryVoting.abi);
        
        // Get account balance
        const balance = await kit.getTotalBalance(account.address);
        console.log('Account balance:', balance.CELO.toString());
        
        // Get current gas price
        const gasPrice = await web3.eth.getGasPrice();
        console.log('Current network gas price:', gasPrice);
        
        // Estimate gas
        const deploy = contract.deploy({
            data: BinaryVoting.bytecode
        });
        
        const gas = await deploy.estimateGas();
        console.log('Estimated gas:', gas);
        
        // Deploy contract with network's gas price
        console.log('Deploying contract...');
        const newContractInstance = await deploy.send({
            from: account.address,
            gas: Math.floor(gas * 1.5), // Add 50% buffer for safety
            gasPrice: gasPrice
        });
        
        console.log('Contract deployed at:', newContractInstance.options.address);
        return newContractInstance;
    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
}

deployContract(); 