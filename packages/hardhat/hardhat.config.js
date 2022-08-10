require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.15",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  paths: {
    artifacts: '../frontend/auction_house/src/artifacts'
  }, 
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  },
  networks: {
    localhost: {
      url: "http://localhost:8545"
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [`${process.env.GOERLI_ACCOUNT_PK}`]
    },
  }
};
