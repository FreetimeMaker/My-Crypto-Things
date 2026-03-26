const hre = require("hardhat");

async function main() {
  const GrayCat = await hre.ethers.getContractFactory("GrayCat");
  const grayCat = await GrayCat.deploy();

  await grayCat.waitForDeployment();

  console.log("GrayCat deployed to:", await grayCat.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
