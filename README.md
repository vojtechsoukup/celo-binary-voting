# Binary Voting DApp on Celo

A decentralized application (DApp) for binary voting on the Celo blockchain. This project allows users to create proposals and vote on them using a simple yes/no (agree/disagree) mechanism.

## Features

- Create new proposals with descriptions
- Vote on existing proposals (Agree/Disagree)
- View proposal details including vote counts
- Real-time updates of voting results
- MetaMask wallet integration
- Clean and intuitive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask wallet
- Celo mainnet configuration in MetaMask

## Smart Contract

The smart contract is deployed on the Celo mainnet at address: `0x94170E4ef7f2de4f0FA77Eb9b10D0701f6eFf4e2`

### Contract Functions

- `addProposal(string description)`: Create a new proposal
- `vote(uint256 proposalId, bool agree)`: Vote on a proposal
- `getProposal(uint256 proposalId)`: Get proposal details
- `getProposalCount()`: Get total number of proposals

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/celo-binary-voting.git
cd celo-binary-voting
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MetaMask for Celo Mainnet

1. Open MetaMask
2. Click on the network dropdown and select "Add Network"
3. Add the following network details:
   - Network Name: Celo Mainnet
   - RPC URL: https://forno.celo.org
   - Chain ID: 42220
   - Currency Symbol: CELO
   - Block Explorer URL: https://explorer.celo.org

## Running the Application

### Start the Development Server

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage Guide

### Connecting Your Wallet

1. Open the application in your browser
2. Click the "Connect Wallet" button
3. Approve the connection request in MetaMask
4. Your wallet address will be displayed when connected

### Creating a Proposal

1. Enter a description for your proposal in the input field
2. Click the "Add Proposal" button
3. Confirm the transaction in MetaMask
4. Wait for the transaction to be confirmed
5. Your proposal will appear in the list

### Voting on Proposals

1. Find the proposal you want to vote on in the list
2. Click either "Agree" or "Disagree" button
3. Confirm the transaction in MetaMask
4. Wait for the transaction to be confirmed
5. The vote counts will update automatically

## Project Structure

```
celo-binary-voting/
├── contracts/           # Smart contract source files
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── context/    # Web3 context and providers
│   │   ├── components/ # React components
│   │   └── config.js   # Contract configuration
├── scripts/            # Deployment and interaction scripts
└── tests/              # Test files
```

## Testing

### Run Smart Contract Tests

```bash
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Celo](https://celo.org/) for the blockchain platform
- [React](https://reactjs.org/) for the frontend framework
- [Chakra UI](https://chakra-ui.com/) for the UI components
- [ethers.js](https://docs.ethers.io/) for blockchain interactions 