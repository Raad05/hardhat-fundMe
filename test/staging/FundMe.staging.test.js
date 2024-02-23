const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let contract;
      let deployer;
      const sendValue = ethers.parseEther("1");

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        contract = await contract.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function () {
        await contract.sendFund({ value: sendValue });
        await contract.withdrawFund();
        const endingBalance = await ethers.provider.getBalance(contract.target);
        assert.equal(endingBalance.toString(), "0");
      });
    });
