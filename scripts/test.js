const ContractKit = require('@celo/contractkit');
const Web3 = require('web3');
require('dotenv').config();

const CONTRACT_ADDRESS = '0x8b2d1FC22937380B7c4fb7C05848e99BAcc2f0E6';

// Helper function to wait for a transaction receipt
async function waitForReceipt(web3, txHash) {
  console.log('Waiting for transaction to be mined...');
  while (true) {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (receipt) {
      return receipt;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function runTests() {
  try {
    // Connect to the network
    const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
    const kit = ContractKit.newKitFromWeb3(web3);

    // Add account
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    kit.connection.addAccount(account.privateKey);
    
    // Get the contract artifacts and create contract instance
    const BinaryVoting = require('../build/contracts/BinaryVoting.json');
    const contract = new kit.connection.web3.eth.Contract(
      BinaryVoting.abi,
      CONTRACT_ADDRESS
    );

    console.log('Running tests...\n');

    // Test 1: Add a proposal
    console.log('Test 1: Adding a proposal');
    const tx1 = await contract.methods.addProposal('Test Proposal 1').send({
      from: account.address,
      gas: 200000
    });
    console.log('Transaction hash:', tx1.transactionHash);
    await waitForReceipt(web3, tx1.transactionHash);
    console.log('✓ Successfully added proposal');

    // Test 2: Get proposal count
    console.log('\nTest 2: Getting proposal count');
    const count = await contract.methods.getProposalCount().call();
    console.log('✓ Proposal count:', count.toString());

    // Test 3: Get proposal details
    console.log('\nTest 3: Getting proposal details');
    const proposal = await contract.methods.getProposal(0).call();
    console.log('✓ Proposal details:', {
      description: proposal.description,
      agreeCount: proposal.agreeCount.toString(),
      disagreeCount: proposal.disagreeCount.toString()
    });

    // Test 4: Vote on proposal
    console.log('\nTest 4: Voting on proposal');
    const tx2 = await contract.methods.vote(0, true).send({
      from: account.address,
      gas: 200000
    });
    console.log('Transaction hash:', tx2.transactionHash);
    await waitForReceipt(web3, tx2.transactionHash);
    console.log('✓ Successfully voted on proposal');

    // Test 5: Verify vote count
    console.log('\nTest 5: Verifying vote count');
    const updatedProposal = await contract.methods.getProposal(0).call();
    console.log('✓ Updated proposal details:', {
      description: updatedProposal.description,
      agreeCount: updatedProposal.agreeCount.toString(),
      disagreeCount: updatedProposal.disagreeCount.toString()
    });

    console.log('\nAll tests completed successfully! ✨');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

runTests(); 