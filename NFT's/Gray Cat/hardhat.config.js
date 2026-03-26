require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { SEPOLIA_PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.28",
   networks: {
       sepolia: {
           url: "https://sepolia.infura.io/v3/59f1bf9447da4b3192c8ec568148611c",
           accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
       },
   },
};