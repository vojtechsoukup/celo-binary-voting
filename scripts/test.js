const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');
require('dotenv').config();

const CONTRACT_ADDRESS = '0xa599509b41e66529750c2DBD28B2B6f8B913D281';

async function testContract() {
    try {
        // Initialize ContractKit
        const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
        const kit = ContractKit.newKitFromWeb3(web3);

        // Add account
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        kit.connection.addAccount(account.privateKey);
        const address = account.address;

        console.log('Interacting from account:', address);

        // Get contract instance
        const BinaryVoting = require('../build/contracts/BinaryVoting.json');
        const contract = new kit.connection.web3.eth.Contract(
            BinaryVoting.abi,
            CONTRACT_ADDRESS
        );

        // 1. Add a new proposal
        console.log('\nAdding new proposal...');
        const tx1 = await contract.methods.addProposal('Should we adopt a new governance model?').send({ from: address });
        console.log('Proposal added in transaction:', tx1.transactionHash);

        // Wait a bit for the transaction to be mined
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 2. Vote on the proposal
        console.log('\nVoting on the proposal...');
        const tx2 = await contract.methods.vote(0, true).send({ from: address });
        console.log('Vote cast in transaction:', tx2.transactionHash);

        // Wait a bit for the transaction to be mined
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 3. Get proposal details
        console.log('\nGetting proposal details...');
        const proposal = await contract.methods.getProposal(0).call();
        console.log('Proposal details:');
        console.log('Description:', proposal.description);
        console.log('Agree count:', proposal.agreeCount);
        console.log('Disagree count:', proposal.disagreeCount);

    } catch (error) {
        console.error('Error testing contract:', error);
        process.exit(1);
    }
}

testContract(); 