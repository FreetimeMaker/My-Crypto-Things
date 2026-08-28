const hre = require("hardhat");

async function main() {
  const GrayCat = await hre.ethers.getContractFactory("GrayCat");
  const grayCat = await GrayCat.attach("0x453a16C27AB2F7550ADc697a43402ff2c511f1ba");

  const tx = await grayCat.mint(
    "0x5878b445F494Ce820CB7d805C23fbA73cb7Bb9E3",
    "ipfs://bafkreia6kefbcegppz43heo4ysbb4qhex7paxedh5mlyvxncxuv7myc6ly"
  );

  const receipt = await tx.wait();
  console.log("Minted! Tx hash:", receipt.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
