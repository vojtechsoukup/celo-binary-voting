const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');
require('dotenv').config();

const CONTRACT_ADDRESS = '0x8b2d1FC22937380B7c4fb7C05848e99BAcc2f0E6';

// Simulated voters with different voting patterns
const VOTING_PATTERNS = [
    { name: 'Alice', votes: [true, false, true] },    // Agree, Disagree, Agree
    { name: 'Bob', votes: [true, true, false] },      // Agree, Agree, Disagree
    { name: 'Charlie', votes: [false, true, true] },  // Disagree, Agree, Agree
    { name: 'Diana', votes: [false, false, true] },   // Disagree, Disagree, Agree
    { name: 'Eve', votes: [true, false, false] }      // Agree, Disagree, Disagree
];

// Sample proposals for testing
const PROPOSALS = [
    "Should we implement a new tokenomics model?",
    "Should we increase the development team size?",
    "Should we allocate more resources to marketing?"
];

async function waitForTransaction(txHash, web3) {
    console.log(`Waiting for transaction ${txHash} to be mined...`);
    let receipt = null;
    while (!receipt) {
        receipt = await web3.eth.getTransactionReceipt(txHash);
        if (!receipt) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    return receipt;
}

async function comprehensiveTest() {
    try {
        // Initialize ContractKit
        const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
        const kit = ContractKit.newKitFromWeb3(web3);

        // Add account
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        kit.connection.addAccount(account.privateKey);
        const address = account.address;

        console.log('Starting comprehensive test from account:', address);

        // Get contract instance
        const BinaryVoting = require('../build/contracts/BinaryVoting.json');
        const contract = new kit.connection.web3.eth.Contract(
            BinaryVoting.abi,
            CONTRACT_ADDRESS
        );

        // 1. Create multiple proposals
        console.log('\n=== Creating Proposals ===');
        for (const proposal of PROPOSALS) {
            console.log(`Creating proposal: "${proposal}"`);
            const tx = await contract.methods.addProposal(proposal).send({ from: address });
            await waitForTransaction(tx.transactionHash, web3);
            console.log(`Proposal created in transaction: ${tx.transactionHash}`);
        }

        // 2. Simulate voting from different accounts
        console.log('\n=== Simulating Voting Process ===');
        for (let i = 0; i < VOTING_PATTERNS.length; i++) {
            const voter = VOTING_PATTERNS[i];
            console.log(`\n${voter.name} is voting:`);
            
            for (let proposalIndex = 0; proposalIndex < PROPOSALS.length; proposalIndex++) {
                const vote = voter.votes[proposalIndex];
                console.log(`  - Proposal ${proposalIndex}: ${vote ? 'AGREE' : 'DISAGREE'}`);
                
                try {
                    const tx = await contract.methods.vote(proposalIndex, vote).send({ from: address });
                    await waitForTransaction(tx.transactionHash, web3);
                    console.log(`    Vote cast in transaction: ${tx.transactionHash}`);
                } catch (error) {
                    if (error.message.includes('Already voted')) {
                        console.log('    Already voted on this proposal');
                    } else {
                        throw error;
                    }
                }
            }
        }

        // 3. Get final results for all proposals
        console.log('\n=== Final Results ===');
        for (let i = 0; i < PROPOSALS.length; i++) {
            const proposal = await contract.methods.getProposal(i).call();
            console.log(`\nProposal ${i}: "${proposal.description}"`);
            console.log(`Agree votes: ${proposal.agreeCount}`);
            console.log(`Disagree votes: ${proposal.disagreeCount}`);
            const totalVotes = Number(proposal.agreeCount) + Number(proposal.disagreeCount);
            console.log(`Total votes: ${totalVotes}`);
            console.log(`Result: ${Number(proposal.agreeCount) > Number(proposal.disagreeCount) ? 'PASSED' : 'FAILED'}`);
        }

        // 4. Test error cases
        console.log('\n=== Testing Error Cases ===');
        
        // Try to vote on non-existent proposal
        try {
            console.log('Attempting to vote on non-existent proposal...');
            await contract.methods.vote(999, true).send({ from: address });
        } catch (error) {
            console.log('Expected error when voting on non-existent proposal:', error.message);
        }

        // Try to vote twice on the same proposal
        try {
            console.log('\nAttempting to vote twice on the same proposal...');
            await contract.methods.vote(0, true).send({ from: address });
        } catch (error) {
            console.log('Expected error when voting twice:', error.message);
        }

        // 5. Get total number of proposals
        const proposalCount = await contract.methods.getProposalCount().call();
        console.log(`\nTotal number of proposals: ${proposalCount}`);

    } catch (error) {
        console.error('Error in comprehensive test:', error);
        process.exit(1);
    }
}

comprehensiveTest(); 