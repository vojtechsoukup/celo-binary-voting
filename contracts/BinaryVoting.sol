// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BinaryVoting {
    // Define the two voting choices
    enum VoteChoice { Agree, Disagree }

    // Structure to represent a proposal with two vote counters
    struct Proposal {
        string description;
        uint256 agreeCount;
        uint256 disagreeCount;
    }

    // Array to store all proposals
    Proposal[] public proposals;

    // Mapping to track if an address has voted on a given proposal
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    // Events for adding proposals and casting votes
    event ProposalAdded(uint256 proposalIndex, string description);
    event VoteCast(address indexed voter, uint256 proposalIndex, VoteChoice choice);

    /// @notice Adds a new proposal
    /// @param description The text describing the proposal
    function addProposal(string calldata description) external {
        proposals.push(Proposal({
            description: description,
            agreeCount: 0,
            disagreeCount: 0
        }));
        emit ProposalAdded(proposals.length - 1, description);
    }

    /// @notice Cast a vote on a proposal
    /// @param proposalIndex The index of the proposal in the proposals array
    /// @param agree Set to true for "agree", false for "disagree"
    function vote(uint256 proposalIndex, bool agree) external {
        require(proposalIndex < proposals.length, "Invalid proposal");
        require(!hasVoted[msg.sender][proposalIndex], "Already voted on this proposal");

        hasVoted[msg.sender][proposalIndex] = true;

        if (agree) {
            proposals[proposalIndex].agreeCount++;
            emit VoteCast(msg.sender, proposalIndex, VoteChoice.Agree);
        } else {
            proposals[proposalIndex].disagreeCount++;
            emit VoteCast(msg.sender, proposalIndex, VoteChoice.Disagree);
        }
    }

    /// @notice Retrieves details of a specific proposal
    /// @param proposalIndex The index of the proposal
    /// @return description The proposal description
    /// @return agreeCount Number of "agree" votes
    /// @return disagreeCount Number of "disagree" votes
    function getProposal(uint256 proposalIndex) external view returns (string memory description, uint256 agreeCount, uint256 disagreeCount) {
        require(proposalIndex < proposals.length, "Invalid proposal");
        Proposal memory proposal = proposals[proposalIndex];
        return (proposal.description, proposal.agreeCount, proposal.disagreeCount);
    }

    /// @notice Returns the total number of proposals
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }
}
