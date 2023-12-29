const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // if chainId is X use address Y
  // if chainId is Z use address A

  // what happens when we want to change chains?
  // when going for localhost or hardhat network we want to use a mock
  const fundMe = await deploy("fundMe", {
    from: deployer,
    args: [], // put priceFeed address
    log: true,
  });
};
