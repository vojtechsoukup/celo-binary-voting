const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');
require('dotenv').config();

const CONTRACT_ADDRESS = '0x94170E4ef7f2de4f0FA77Eb9b10D0701f6eFf4e2';

async function waitForTransaction(web3, txHash) {
    let receipt = null;
    while (receipt === null) {
        receipt = await web3.eth.getTransactionReceipt(txHash);
        if (!receipt) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        }
    }
    return receipt;
}

async function interactWithContract() {
    try {
        // Connect to the network
        const web3 = new Web3('https://forno.celo.org');
        const kit = ContractKit.newKitFromWeb3(web3);

        // Add account from private key
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        kit.connection.addAccount(account.privateKey);

        // Get contract instance
        const BinaryVoting = require('../build/contracts/BinaryVoting.json');
        const contract = new kit.connection.web3.eth.Contract(
            BinaryVoting.abi,
            CONTRACT_ADDRESS
        );

        // Get account balance
        const balance = await kit.getTotalBalance(account.address);
        console.log('Account balance:', Web3.utils.fromWei(balance.CELO.toString(), 'ether'), 'CELO');

        // Create some proposals
        console.log('\nCreating proposals...');
        const proposals = [
            "Should we implement a new feature?",
            "Should we change the voting mechanism?",
            "Should we add a time limit for voting?"
        ];

        for (const proposal of proposals) {
            console.log(`Creating proposal: "${proposal}"`);
            const tx = await contract.methods.addProposal(proposal).send({
                from: account.address,
                gas: 200000
            });
            console.log('Transaction hash:', tx.transactionHash);
            console.log('Waiting for transaction to be mined...');
            await waitForTransaction(web3, tx.transactionHash);
            console.log('Transaction confirmed!');
        }

        // Get proposal count
        const proposalCount = await contract.methods.getProposalCount().call();
        console.log('\nTotal proposals:', proposalCount);

        // Vote on proposals
        console.log('\nVoting on proposals...');
        for (let i = 0; i < proposalCount; i++) {
            // Get proposal details
            const proposal = await contract.methods.getProposal(i).call();
            console.log(`\nProposal ${i}: "${proposal.description}"`);
            console.log('Current votes - Agree:', proposal.agreeCount, 'Disagree:', proposal.disagreeCount);

            // Vote randomly (true for agree, false for disagree)
            const vote = Math.random() > 0.5;
            console.log(`Voting ${vote ? 'AGREE' : 'DISAGREE'} on proposal ${i}`);
            
            const tx = await contract.methods.vote(i, vote).send({
                from: account.address,
                gas: 200000
            });
            console.log('Transaction hash:', tx.transactionHash);
            console.log('Waiting for transaction to be mined...');
            await waitForTransaction(web3, tx.transactionHash);
            console.log('Transaction confirmed!');

            // Get updated proposal details
            const updatedProposal = await contract.methods.getProposal(i).call();
            console.log('Updated votes - Agree:', updatedProposal.agreeCount, 'Disagree:', updatedProposal.disagreeCount);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

interactWithContract(); 