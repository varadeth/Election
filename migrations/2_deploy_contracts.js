var Voting = artifacts.require("Voting")

module.exports = function(deployer) {
  deployer.deploy(Voting).then(()=>console.warn(Voting.address)).then(()=>Voting.deployed()).then(_instance => console.log(_instance.address))
}