const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const contract = await ethers.getContract("FundMe", deployer);
  console.log("Funding contract...");
  const txResponse = await contract.sendFund({
    value: ethers.parseEther("0.1"),
  });
  await txResponse.wait(1);
  console.log("Funded!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
