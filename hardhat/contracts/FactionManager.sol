// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FactionManager {
    // Remove this line
    // address public gameManager;

    // Add admin mapping
    mapping(address => bool) public admins;

    // Replace onlyGameManager with onlyAdmin
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only Admin");
        _;
    }

    // Add function to manage admins (called by GameManager)
    function setAdmin(address admin, bool status) external {
        require(admins[msg.sender], "Only existing admin can add new admins");
        admins[admin] = status;
    }

    struct Faction {
        uint256 factionId;
        string name;
        uint256 currentScore;
        uint256 memberCount;
        uint256 totalVotesReceived;
        uint256 totalAttacks;      // Times this faction was attacked
    }

    // Constants for initialization
    uint256 public constant INITIAL_FACTION_SCORE = 100;
    uint256 public constant FACTION_COUNT = 3;

    mapping(uint256 => Faction) public factions;
    mapping(address => uint256) public userFactions;
    mapping(uint256 => mapping(uint256 => FactionCycleData)) public factionCycleData; // cycleId => factionId => data
    
    // Cycle specific data
    struct FactionCycleData {
        uint256 cycleScore;
        uint256 votesReceived;
        uint256 attacksReceived;
        uint256 memberParticipation;  // Number of members who voted
    }

    // Initialize factions for new cycle
    function initializeCycle(uint256 cycleId) external onlyAdmin {
        // Initialize the three factions with names and starting scores
        _initializeFaction(1, "Red", cycleId);
        _initializeFaction(2, "Green", cycleId);
        _initializeFaction(3, "Blue", cycleId);
    }

    function _initializeFaction(
        uint256 factionId, 
        string memory factionName,
        uint256 cycleId
    ) internal {
        // Set or reset faction data
        factions[factionId] = Faction({
            factionId: factionId,
            name: factionName,
            currentScore: INITIAL_FACTION_SCORE,  // Each faction starts with 1000 points
            memberCount: 0,                       // Reset member count for new cycle
            totalVotesReceived: 0,
            totalAttacks: 0
        });

        // Initialize cycle specific data
        factionCycleData[cycleId][factionId] = FactionCycleData({
            cycleScore: INITIAL_FACTION_SCORE,
            votesReceived: 0,
            attacksReceived: 0,
            memberParticipation: 0
        });
    }

    // Get faction name
    function getFactionName(uint256 factionId) external view returns (string memory) {
        return factions[factionId].name;
    }

    // User joins faction
    function joinFaction(uint256 factionId) external {
        require(factionId > 0 && factionId <= 3, "Invalid faction");
        require(userFactions[msg.sender] == 0, "Already in a faction");
        
        userFactions[msg.sender] = factionId;
        factions[factionId].memberCount++;
    }

    // Optionally, add a helper function to check user's faction
    function getUserFaction() external view returns (uint256) {
        return userFactions[msg.sender];
    }

    // Called by VotingManager through GameManager when votes are finalized
    function processVotingResults(
        uint256 cycleId,
        uint256 targetFactionId,
        uint256 voteCount
    ) external onlyAdmin {
        FactionCycleData storage data = factionCycleData[cycleId][targetFactionId];
        data.votesReceived += voteCount;
    }

    function getFactionScores(uint256 cycleId) external view returns (uint256[] memory) {
        uint256[] memory scores = new uint256[](FACTION_COUNT);
        for (uint256 i = 1; i <= FACTION_COUNT; i++) {
            scores[i - 1] = factions[i].currentScore;
        }
        return scores;
    }

    function resetScores(uint256 cycleId) external onlyAdmin {
        for (uint256 i = 1; i <= FACTION_COUNT; i++) {
            factions[i].currentScore = INITIAL_FACTION_SCORE;
            factionCycleData[cycleId][i].cycleScore = INITIAL_FACTION_SCORE;
        }
    }
}
