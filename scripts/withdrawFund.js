const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const contract = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing from contract...");
  const txResponse = await contract.withdrawFund();
  await txResponse.wait(1);
  console.log("Got it back!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
