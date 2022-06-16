require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.14",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    localhost: {
      url: "http://localhost:8545"
    }
  }
};
