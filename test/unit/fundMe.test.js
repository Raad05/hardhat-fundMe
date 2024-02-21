const { getNamedAccounts, ethers, deployments } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function () {
  let contract;
  let deployer;
  let mockV3Aggregator;
  const sendValue = ethers.parseEther("1");

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

  describe("sendFund", async function () {
    it("fails if you don't send enough ETH", async function () {
      await expect(contract.sendFund()).to.be.revertedWith("Insufficient fund");
    });

    it("updates the amount funded data structure", async function () {
      await contract.sendFund({ value: sendValue });
      const res = await contract.addressToAmountFunded(deployer);
      assert.equal(res.toString(), sendValue.toString());
    });

    it("adds funders to array of funders", async function () {
      await contract.sendFund({ value: sendValue });
      const funder = await contract.funders(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdrawFund", async function () {
    beforeEach(async function () {
      await contract.sendFund({ value: sendValue });
    });

    it("withdraw ETH from a single funder", async function () {
      // Arrange
      const startingContractBalance = await ethers.provider.getBalance(
        contract.target
      );
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      // Act
      const txResponse = await contract.withdrawFund();
      const txReceipt = await txResponse.wait(1);
      const { gasUsed, gasPrice } = txReceipt;
      const gasCost = gasUsed * gasPrice;

      const endingContractBalance = await ethers.provider.getBalance(
        contract.target
      );
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      // Assert
      assert.equal(endingContractBalance, 0);
      assert.equal(
        (startingContractBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + gasCost).toString()
      );
    });

    it("allows us to withdraw with multiple funders", async function () {
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await contract.connect(accounts[i]);
        await fundMeConnectedContract.sendFund({ value: sendValue });

        const startingContractBalance = await ethers.provider.getBalance(
          contract.target
        );
        const startingDeployerBalance = await ethers.provider.getBalance(
          deployer
        );

        const txResponse = await contract.withdrawFund();
        const txReceipt = await txResponse.wait(1);
        const { gasUsed, gasPrice } = txReceipt;
        const gas = gasUsed * gasPrice;

        const endingContractBalance = await ethers.provider.getBalance(
          contract.target
        );
        const endingDeployerBalance = await ethers.provider.getBalance(
          deployer
        );

        assert.equal(endingContractBalance, 0);
        assert.equal(
          (startingContractBalance + startingDeployerBalance).toString(),
          (endingDeployerBalance + gas).toString()
        );

        await expect(contract.funders(0)).to.be.reverted;

        for (let i = 1; i < 6; i++) {
          assert.equal(
            await contract.addressToAmountFunded(accounts[i].address),
            0
          );
        }
      }
    });

    it("only allows the owner to withdraw", async function () {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const attackerConnectedContract = await contract.connect(attacker);
      await expect(attackerConnectedContract.withdrawFund()).to.be.reverted;
    });
  });
});
