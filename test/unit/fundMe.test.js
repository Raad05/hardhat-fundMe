const { getNamedAccounts, ethers, deployments } = require("hardhat");
const { assert } = require("chai");

describe("FundMe", async function () {
  let contract;
  let deployer;
  let mockV3Aggregator;
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    contract = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async function () {
    it("sets the aggregator addresses correctly", async function () {
      const res = await contract.priceFeed();
      assert.equal(res, mockV3Aggregator.target);
    });
  });
});
