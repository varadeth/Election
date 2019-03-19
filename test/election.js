var Election = artifacts.require('./Election.sol');

contract("Election",function(accounts){						//mocha framework
	var ElectionInstance;
	it("initializes with two candidates",function(){
		return Election.deployed().then (function(instance){
			return instance.candidateCount();
		}).then(function(count){
			assert.equal(count,2);							//chai framework
		});
	});
	it("initializes the candidates with the correct values",function(){
		return Election.deployed().then(function(instance){
			ElectionInstance = instance;
			return ElectionInstance.candidates(1);
		}).then(function(candidate){
			assert.equal(candidate[0],1,"contains the correct id");
			assert.equal(candidate[1], "Candidate1", "contains the correct name");
      		assert.equal(candidate[2], 0, "contains the correct votes count");
      		return ElectionInstance.candidates(2);
		}).then(function(candidate){
			assert.equal(candidate[0],2,"contains the correct id");
			assert.equal(candidate[1],"Candidate2","contains the correct name");
			assert.equal(candidate[2],0,"contains the correct votes count");
		});
	});

	it("allows a voter to cast a vote",function(){
		return Election.deployed().then(function(instance){
			ElectionInstance = instance
			candidateId = 1;
			return ElectionInstance.vote(candidateId,{from: accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,"an event was triggered");
			assert.equal(receipt.logs[0].event,"votedEvent","the event type is correct");
			assert.equal(receipt.logs[0].args._candidateId.toNumber(),candidateId,"the candidate Id is correct");
			return ElectionInstance.voters(accounts[0]);
		}).then(function(voted){
			assert(voted,"the voter has marked as voted");
			return ElectionInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount = candidate[2];
			assert.equal(voteCount,1,"increments the vote count");
		})
	});
	it("throws an exception for invalid candidates",function () {
		return Election.deployed().then(function (instance) {
			ElectionInstance = instance;
			return ElectionInstance.vote(99,{from: accounts[1]})
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert')>=0,"error message must contain reverse");
			return ElectionInstance.candidates(1);
		}).then(function(candidate1){
			var voteCount = candidate1[2];
			assert.equal(voteCount,1,"candidate1 did not receive any votes");
			return ElectionInstance.candidates(2);
		}).then(function(candidate2){
			var voteCount = candidate2[2];
			assert.equal(voteCount,0,"candidate2 did not receive any votes");
		});
	});
	it("throws an exception for double voting",function(){
		return Election.deployed().then(function(instance){
			ElectionInstance = instance;
			candidateId = 2;
			ElectionInstance.vote(candidateId,{from:accounts[1]});
			return ElectionInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount = candidate[2];
			assert.equal(voteCount,1,"accepts first vote");
		});
	});
});