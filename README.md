# 🗳️ Binary Voting Smart Contract on Celo

A smart contract for binary voting on the Celo blockchain. This contract allows users to create proposals and vote on them using a simple yes/no (agree/disagree) mechanism.

## ✨ Features

- 📝 Create new proposals with descriptions
- ✅ Vote on existing proposals (Agree/Disagree)
- 👀 View proposal details including vote counts
- 🔒 Prevent double voting
- 📢 Event emission for proposal creation and voting

## 📋 Prerequisites

- 🦊 MetaMask wallet
- 🌐 Celo mainnet configuration in MetaMask
- 💰 Some CELO tokens for transaction fees

## 📜 Smart Contract

The smart contract is deployed on the Celo mainnet at address: `0x94170E4ef7f2de4f0FA77Eb9b10D0701f6eFf4e2`

### 🔧 Contract Functions

- `addProposal(string description)`: Create a new proposal
- `vote(uint256 proposalId, bool agree)`: Vote on a proposal
- `getProposal(uint256 proposalId)`: Get proposal details
- `getProposalCount()`: Get total number of proposals

## ⚙️ Setup Instructions

### 1. Configure MetaMask for Celo Mainnet

1. Open MetaMask
2. Click on the network dropdown and select "Add Network"
3. Add the following network details:
   - Network Name: Celo Mainnet
   - RPC URL: https://forno.celo.org
   - Chain ID: 42220
   - Currency Symbol: CELO
   - Block Explorer URL: https://explorer.celo.org

## 📖 Usage Guide

### Interacting with the Contract

You can interact with the contract directly through the [Celo Explorer](https://explorer.celo.org/address/0x94170E4ef7f2de4f0FA77Eb9b10D0701f6eFf4e2):

#### 📝 Creating a Proposal

1. Go to the [contract page](https://explorer.celo.org/address/0x94170E4ef7f2de4f0FA77Eb9b10D0701f6eFf4e2)
2. Click on "Write Contract"
3. Connect your wallet
4. Find the `addProposal` function
5. Enter your proposal description in the `description` field
6. Click "Write" and confirm the transaction in MetaMask

#### ✅ Voting on a Proposal

1. Go to the [contract page](https://explorer.celo.org/address/0x94170E4ef7f2de4f0FA77Eb9b10D0701f6eFf4e2)
2. Click on "Write Contract"
3. Connect your wallet
4. Find the `vote` function
5. Enter the proposal ID in the `proposalId` field
6. Set `agree` to `true` for "Agree" or `false` for "Disagree"
7. Click "Write" and confirm the transaction in MetaMask

#### 👀 Viewing Proposals

1. Go to the [contract page](https://explorer.celo.org/address/0x94170E4ef7f2de4f0FA77Eb9b10D0701f6eFf4e2)
2. Click on "Read Contract"
3. Use `getProposalCount` to see the total number of proposals
4. Use `getProposal` to view details of a specific proposal by entering its ID

## 📁 Project Structure

```
celo-binary-voting/
├── contracts/           # Smart contract source files
├── scripts/            # Deployment and interaction scripts
└── tests/              # Test files
```

## 🧪 Testing

### Run Smart Contract Tests

```bash
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Celo](https://celo.org/) for the blockchain platform
- [OpenZeppelin](https://openzeppelin.com/) for the secure smart contract libraries 