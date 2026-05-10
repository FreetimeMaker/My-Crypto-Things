const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const GrayCat = await hre.ethers.getContractFactory("GrayCat");
  
  // Gas-Schätzung (optional, aber hilfreich)
  const deploymentData = GrayCat.getDeployTransaction();
  const estimateGas = await hre.ethers.provider.estimateGas(deploymentData);
  const feeData = await hre.ethers.provider.getFeeData();
  
  // Nutze maxFeePerGas für EIP-1559 (Mainnet Standard) und füge 10% Puffer hinzu
  const gasPrice = feeData.maxFeePerGas || feeData.gasPrice;
  const estimatedCost = (estimateGas * gasPrice * 110n) / 100n;

  console.log("Estimated deployment cost:", hre.ethers.formatEther(estimatedCost), "ETH");
  if (balance < estimatedCost) {
    throw new Error("Insufficient funds for deployment");
  }

  const grayCat = await GrayCat.deploy();
  await grayCat.waitForDeployment(5); // Warte auf 5 Bestätigungen (sicherer für Mainnet)

  console.log("GrayCat deployed to:", await grayCat.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
