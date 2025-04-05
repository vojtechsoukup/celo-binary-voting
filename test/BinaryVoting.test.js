const BinaryVoting = artifacts.require("BinaryVoting");

contract("BinaryVoting", accounts => {
  let binaryVoting;
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  beforeEach(async () => {
    binaryVoting = await BinaryVoting.new({ from: owner });
  });

  it("should create a new proposal", async () => {
    const description = "Test Proposal";
    await binaryVoting.addProposal(description, { from: owner });
    
    const proposalCount = await binaryVoting.getProposalCount();
    assert.equal(proposalCount.toNumber(), 1, "Should have one proposal");

    const [storedDescription, agreeCount, disagreeCount] = await binaryVoting.getProposal(0);
    assert.equal(storedDescription, description, "Description should match");
    assert.equal(agreeCount.toNumber(), 0, "Initial agree count should be 0");
    assert.equal(disagreeCount.toNumber(), 0, "Initial disagree count should be 0");
  });

  it("should allow voting on a proposal", async () => {
    await binaryVoting.addProposal("Test Proposal", { from: owner });
    
    // Vote agree
    await binaryVoting.vote(0, true, { from: voter1 });
    let [_, agreeCount, disagreeCount] = await binaryVoting.getProposal(0);
    assert.equal(agreeCount.toNumber(), 1, "Agree count should be 1");
    assert.equal(disagreeCount.toNumber(), 0, "Disagree count should be 0");

    // Vote disagree
    await binaryVoting.vote(0, false, { from: voter2 });
    [_, agreeCount, disagreeCount] = await binaryVoting.getProposal(0);
    assert.equal(agreeCount.toNumber(), 1, "Agree count should still be 1");
    assert.equal(disagreeCount.toNumber(), 1, "Disagree count should be 1");
  });

  it("should prevent double voting", async () => {
    await binaryVoting.addProposal("Test Proposal", { from: owner });
    await binaryVoting.vote(0, true, { from: voter1 });
    
    try {
      await binaryVoting.vote(0, true, { from: voter1 });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Already voted on this proposal");
    }
  });
});
