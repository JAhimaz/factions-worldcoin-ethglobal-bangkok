// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingManager {
    mapping(address => bool) public admins;
    
    struct VotingSession {
        bool isActive;
        uint256 startTime;
        uint256 endTime;
        mapping(uint256 => uint256) factionVotes;
    }
    
    VotingSession public currentSession;
    mapping(address => bool) public hasVoted;

    // XP Constants
    uint256 constant EARLY_VOTER_XP = 100;
    uint256 constant MID_VOTER_XP = 50;
    uint256 constant LATE_VOTER_XP = 25;
    uint256 constant EARLY_VOTE_DURATION = 8 hours;
    uint256 constant MID_VOTE_DURATION = 16 hours;

    event VoteCast(address voter, uint256 targetFactionId, uint256 xpEarned);

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only Admin");
        _;
    }

    function startVotingSession() external onlyAdmin {
        require(!currentSession.isActive, "Session already active");
        currentSession.isActive = true;
        currentSession.startTime = block.timestamp;
        currentSession.endTime = block.timestamp + 24 hours;
    }

    function endVotingSession() external onlyAdmin {
        require(currentSession.isActive, "No active session");
        currentSession.isActive = false;
    }

    function castVote(uint256 targetFactionId) external {
        require(currentSession.isActive, "No active session");
        require(!hasVoted[msg.sender], "Already voted");
        require(block.timestamp <= currentSession.endTime, "Voting ended");
        
        // Record vote
        hasVoted[msg.sender] = true;
        currentSession.factionVotes[targetFactionId]++;
        
        // Calculate XP and emit event for GameManager to handle
        uint256 xpAmount = calculateVotingXP();
        emit VoteCast(msg.sender, targetFactionId, xpAmount);
    }

    function calculateVotingXP() internal view returns (uint256) {
        uint256 timeElapsed = block.timestamp - currentSession.startTime;
        
        if (timeElapsed <= EARLY_VOTE_DURATION) {
            return EARLY_VOTER_XP;
        } else if (timeElapsed <= MID_VOTE_DURATION) {
            return MID_VOTER_XP;
        } else {
            return LATE_VOTER_XP;
        }
    }

    function getVotes(uint256 factionId) external view returns (uint256) {
        return currentSession.factionVotes[factionId];
    }

    // Add function to manage admins (called by GameManager)
    function setAdmin(address admin, bool status) external {
        require(admins[msg.sender], "Only existing admin can add new admins");
        admins[admin] = status;
    }

}

