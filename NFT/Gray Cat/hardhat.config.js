require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { MAINNET_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
   solidity: "0.8.28",
   networks: {
       mainnet: {
           url: "https://mainnet.infura.io/v3/59f1bf9447da4b3192c8ec568148611c",
           accounts: MAINNET_PRIVATE_KEY ? [MAINNET_PRIVATE_KEY] : [],
       },
   },
   etherscan: {
       apiKey: ETHERSCAN_API_KEY,
   },
};