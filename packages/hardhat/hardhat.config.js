require("@nomiclabs/hardhat-waffle");

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
  networks: {
    localhost: {
      url: "http://localhost:8545"
    }/*,
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraID}`,
      accounts: [`${goerliAccountPk}`]
    },*/
  }
};
