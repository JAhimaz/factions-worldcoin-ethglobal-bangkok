// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VotingManager.sol";
import "./FactionManager.sol";

contract GameManager {
    uint256 public currentCycle;
    uint256 public cycleStartTime;
    uint256 constant CYCLE_DURATION = 7 days;
    
    struct CycleResults {
        uint256 winningFaction;
        uint256[] scores;  // scores[factionId] = score
        uint256 timestamp;
    }
    
    mapping(uint256 => CycleResults) public cycleHistory;
    
    mapping(address => uint256) public userXP;
    
    VotingManager public votingManager;
    FactionManager public factionManager;

    mapping(address => bool) public admins;
    event AdminAdded(address admin);
    event AdminRemoved(address admin);
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not authorized");
        _;
    }
    
    constructor(address _votingManager) {
        votingManager = VotingManager(_votingManager);
        
        // Set deployer as admin
        admins[msg.sender] = true;
        
        // Whitelist specific addresses as admins
        address whitelistedAdmins = 0x58Eb309110350E83814442C929a9658AFAA81f60;
   
        // Add whitelisted admins
        admins[whitelistedAdmins] = true;
        emit AdminAdded(whitelistedAdmins);
        
    }
    
    function addAdmin(address newAdmin) external onlyAdmin {
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
        
        // Propagate admin status to other contracts
        votingManager.setAdmin(newAdmin, true);
        factionManager.setAdmin(newAdmin, true);
    }
    
    function removeAdmin(address admin) external onlyAdmin {
        admins[admin] = false;
        emit AdminRemoved(admin);
        
        // Remove admin status from other contracts
        votingManager.setAdmin(admin, false);
        factionManager.setAdmin(admin, false);
    }
    
    function startNewCycle() external onlyAdmin {
        // End current cycle
        if (currentCycle > 0) {
            endCycle();
        }
        
        currentCycle++;
        cycleStartTime = block.timestamp;
        
        // Create new voting session
        votingManager.startVotingSession();
    }

    function calculateWinner(uint256[] memory scores) internal pure returns (uint256) {
        uint256 maxScore = 0;
        uint256 winningFaction = 0;
        
        for (uint256 i = 0; i < scores.length; i++) {
            if (scores[i] > maxScore) {
                maxScore = scores[i];
                winningFaction = i;
            }
        }
        
        return winningFaction;
    }
    
    function endCycle() internal {
        // Calculate final scores
        uint256[] memory finalScores = factionManager.getFactionScores(currentCycle);
        uint256 winner = calculateWinner(finalScores);
        
        // Store results
        cycleHistory[currentCycle] = CycleResults({
            winningFaction: winner,
            scores: finalScores,
            timestamp: block.timestamp
        });
        
        // Reset scores for next cycle
        factionManager.resetScores(currentCycle);
    }
    
    function handleVoteCast(address voter, uint256 xpAmount) external {
        require(msg.sender == address(votingManager), "Only VotingManager");
        userXP[voter] += xpAmount;
    }
    
    function getUserXP(address user) external view returns (uint256) {
        return userXP[user];
    }

    // Add function to set FactionManager reference
    function setFactionManager(address _factionManager) external onlyAdmin {
        factionManager = FactionManager(_factionManager);
        // Set initial admin status
        factionManager.setAdmin(msg.sender, true);
    }

}

