const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("Verifying contracts...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message.toLowerCase().includes("arlready verified")) {
      console.log("Already verified");
    } else {
      console.log(err);
    }
  }
};

module.exports = { verify };
