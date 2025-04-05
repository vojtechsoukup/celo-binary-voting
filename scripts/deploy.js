const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');
require('dotenv').config();

async function deployContract() {
    try {
        // Initialize ContractKit with the Alfajores testnet
        const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
        const kit = ContractKit.newKitFromWeb3(web3);

        // Add account
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        kit.connection.addAccount(account.privateKey);
        const address = account.address;

        console.log('Deploying from account:', address);

        // Get contract artifacts
        const BinaryVoting = require('../build/contracts/BinaryVoting.json');

        // Create contract instance
        const instance = new kit.connection.web3.eth.Contract(BinaryVoting.abi);
        
        // Estimate gas
        const deploy = instance.deploy({
            data: BinaryVoting.bytecode
        });
        
        const gas = await deploy.estimateGas();
        
        // Deploy contract
        console.log('Deploying contract...');
        const newContractInstance = await deploy.send({
            from: address,
            gas: Math.round(gas * 1.5) // Add 50% buffer to estimated gas
        });

        console.log('Contract deployed at:', newContractInstance.options.address);
        return newContractInstance;
    } catch (error) {
        console.error('Error deploying contract:', error);
        process.exit(1);
    }
}

deployContract(); 