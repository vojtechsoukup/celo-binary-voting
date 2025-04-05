const BinaryVoting = artifacts.require("BinaryVoting");

module.exports = function(deployer) {
  deployer.deploy(BinaryVoting);
};
