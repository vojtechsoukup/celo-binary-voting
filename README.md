# Binary Voting Smart Contract

A simple binary voting smart contract deployed on the Celo testnet. This contract allows users to create proposals and vote on them with binary choices (Agree/Disagree).

## Features

- Create new proposals
- Vote on proposals (Agree/Disagree)
- View proposal details and vote counts
- Prevent double voting
- Event emission for proposal creation and voting

## Contract Details

The contract is written in Solidity and deployed on the Celo Alfajores testnet.

### Functions

- `addProposal(string description)`: Creates a new proposal
- `vote(uint256 proposalIndex, bool agree)`: Casts a vote on a proposal
- `getProposal(uint256 proposalIndex)`: Retrieves proposal details
- `getProposalCount()`: Returns the total number of proposals

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
- Copy `.env.example` to `.env`
- Add your wallet mnemonic phrase to `.env`

3. Deploy to Celo testnet:
```bash
truffle migrate --network alfajores
```

## Testing

Run the test suite:
```bash
truffle test
```

## License

MIT 