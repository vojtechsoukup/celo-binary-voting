// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BinaryVoting
 * @dev A smart contract for binary voting (agree/disagree) on proposals
 */
contract BinaryVoting {
    // ============ Enums ============
    
    /// @notice Possible voting choices
    enum VoteChoice { 
        Agree, 
        Disagree 
    }

    // ============ Structs ============
    
    /// @notice Structure representing a voting proposal
    struct Proposal {
        string description;      // Description of the proposal
        uint256 agreeCount;     // Number of agree votes
        uint256 disagreeCount;  // Number of disagree votes
    }

    // ============ State Variables ============
    
    // Array of all proposals
    Proposal[] private _proposals;

    // Mapping to track if an address has voted on a proposal
    mapping(address => mapping(uint256 => bool)) private _hasVoted;

    // ============ Events ============
    
    /// @notice Emitted when a new proposal is added
    event ProposalAdded(
        uint256 indexed proposalIndex,
        string description
    );

    /// @notice Emitted when a vote is cast
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalIndex,
        VoteChoice choice
    );

    // ============ External Functions ============

    /**
     * @notice Adds a new proposal to the voting system
     * @param description The text describing the proposal
     */
    function addProposal(string calldata description) external {
        _proposals.push(Proposal({
            description: description,
            agreeCount: 0,
            disagreeCount: 0
        }));
        emit ProposalAdded(_proposals.length - 1, description);
    }

    /**
     * @notice Casts a vote on a proposal
     * @param proposalIndex The index of the proposal to vote on
     * @param agree true for agree, false for disagree
     * @dev Reverts if proposal doesn't exist or voter has already voted
     */
    function vote(uint256 proposalIndex, bool agree) external {
        require(proposalIndex < _proposals.length, "Invalid proposal");
        require(!_hasVoted[msg.sender][proposalIndex], "Already voted");

        _hasVoted[msg.sender][proposalIndex] = true;

        if (agree) {
            _proposals[proposalIndex].agreeCount++;
            emit VoteCast(msg.sender, proposalIndex, VoteChoice.Agree);
        } else {
            _proposals[proposalIndex].disagreeCount++;
            emit VoteCast(msg.sender, proposalIndex, VoteChoice.Disagree);
        }
    }

    // ============ View Functions ============

    /**
     * @notice Gets details of a specific proposal
     * @param proposalIndex The index of the proposal
     * @return description The proposal description
     * @return agreeCount Number of agree votes
     * @return disagreeCount Number of disagree votes
     */
    function getProposal(uint256 proposalIndex) 
        external 
        view 
        returns (
            string memory description,
            uint256 agreeCount,
            uint256 disagreeCount
        ) 
    {
        require(proposalIndex < _proposals.length, "Invalid proposal");
        Proposal memory proposal = _proposals[proposalIndex];
        return (
            proposal.description,
            proposal.agreeCount,
            proposal.disagreeCount
        );
    }

    /**
     * @notice Gets the total number of proposals
     * @return The number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return _proposals.length;
    }
}
