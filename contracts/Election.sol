pragma solidity 0.4.24;

contract Election{
	
	struct Candidate{
		uint id;
		string name;
		uint voteCount;
	}

	mapping(address => bool) public voters;

	mapping(uint => Candidate) public candidates;

	uint public candidateCount;

	event votedEvent(
		uint indexed _candidateId
	);
		constructor() public {
		addCandidate("Sandesh");
		addCandidate("Ajay");
	}

	function addCandidate(string _name) private {
		candidateCount++;
		candidates[candidateCount] = Candidate(candidateCount,_name,0);
	}

	function vote(uint _candidateId) public {
		//check address has not voted
		require(!voters[msg.sender]);

		//vote a valid candidates
		require( _candidateId >0 && _candidateId <= candidateCount);

		//Vote increase
		candidates[_candidateId].voteCount ++;

		//
		voters[msg.sender] = true;

		votedEvent(_candidateId);
	}
}