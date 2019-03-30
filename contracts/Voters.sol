pragma solidity ^0.4.18;
// written for Solidity version 0.4.18 and above that doesnt break functionality

contract Voting {
    event AddedCandidate(uint candidateID);

    // describes a Voter, which has an id and the ID of the candidate they voted for
    struct Voter {
        bytes32 uid; // bytes32 type are basically strings
        uint candidateIDVote;
    }
    // describes a Candidate
    struct Candidate {
        bytes32 name;
        bytes32 party; 
        bool doesExist; 
    }

    // These state variables are used keep track of the number of Candidates/Voters and used to as a way to index them     
    uint numCandidates = 0; // declares a state variable - number Of Candidates
    uint numVoters;

    
    // Think of these as a hash table
    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;
    mapping (bytes32 => bool) public voted;
    
    constructor() public {
        addCandidate("Sandesh Chatarmal","BJP");
        addCandidate("Ajay Khaple","Congress");
        addCandidate("Jaydeep Patil","Shivsena");
    }
    function addCandidate(bytes32 name, bytes32 party) public {
        uint candidateID = numCandidates++;
        // Create new Candidate Struct with name and saves it to storage.
        candidates[candidateID] = Candidate(name,party,true);
        AddedCandidate(candidateID);
    }

    function vote(bytes32 uid, uint candidateID) public {

        if (candidates[candidateID].doesExist == true) {
            uint voterID = numVoters++; //voterID is the return variable
            voters[voterID] = Voter(uid,candidateID);
            voted[uid] = true;
        }
    }
    

    // finds the total amount of votes for a specific candidate by looping through voters 
    function totalVotes(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0; // we will return this
        for (uint i = 0; i < numVoters; i++) {
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return numOfVotes; 
    }

    function getNumOfCandidates() public view returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint) {
        return numVoters;
    }
    function getCandidate(uint candidateID) public view returns (uint,bytes32, bytes32) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].party);
    }
}