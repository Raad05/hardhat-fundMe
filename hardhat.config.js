require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || "SEPOLIA_RPC";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "PRIVATE_KEY";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API";

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    users: {
      default: 1,
    },
  },
};
