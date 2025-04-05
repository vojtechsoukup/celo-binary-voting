const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');
require('dotenv').config();

async function checkBalance() {
    const web3 = new Web3('https://forno.celo.org');
    const kit = ContractKit.newKitFromWeb3(web3);
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    
    const balance = await kit.getTotalBalance(account.address);
    console.log('Account address:', account.address);
    console.log('CELO balance:', Web3.utils.fromWei(balance.CELO.toString(), 'ether'), 'CELO');
    
    // Get current gas price
    const gasPrice = await web3.eth.getGasPrice();
    console.log('Current gas price:', Web3.utils.fromWei(gasPrice.toString(), 'gwei'), 'gwei');
    
    return { balance, gasPrice, account };
}

async function deployContract() {
    try {
        // Check balance first
        const { balance, gasPrice, account } = await checkBalance();
        
        // Minimum required balance (0.1 CELO)
        const minimumBalance = Web3.utils.toWei('0.1', 'ether');
        if (balance.CELO.lt(minimumBalance)) {
            console.error('Insufficient balance. Please fund your account with at least 0.1 CELO');
            process.exit(1);
        }

        // Connect to the network - using mainnet RPC
        const web3 = new Web3('https://forno.celo.org');
        const kit = ContractKit.newKitFromWeb3(web3);
        kit.connection.addAccount(account.privateKey);
        
        // Get the contract artifacts
        const BinaryVoting = require('../build/contracts/BinaryVoting.json');
        
        // Create contract instance
        const contract = new kit.connection.web3.eth.Contract(BinaryVoting.abi);
        
        // Estimate gas
        const deploy = contract.deploy({
            data: BinaryVoting.bytecode
        });
        
        const gas = await deploy.estimateGas();
        console.log('Estimated gas:', gas);
        
        // Calculate total cost
        const totalCost = Web3.utils.toBN(gas).mul(Web3.utils.toBN(gasPrice));
        console.log('Estimated total cost:', Web3.utils.fromWei(totalCost.toString(), 'ether'), 'CELO');
        
        // Deploy contract with network's gas price
        console.log('Deploying contract to Celo mainnet...');
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

// First check balance
checkBalance().then(() => {
    console.log('\nWould you like to proceed with deployment? Press Ctrl+C to cancel, or wait 10 seconds to continue...');
    setTimeout(() => {
        deployContract();
    }, 10000);
}); 