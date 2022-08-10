require('dotenv').config();

export const NETWORKS = {
    localhost: {
        name: "localhost",
        color: "#666666",
        chainId: 1337,
        blockExplorer: "",
        rpcUrl: "http://" + window.location.hostname + ":8545",
    },
    goerli: {
        name: "Goerli",
        color: "#3099f2",
        chainId: 5,
        rpcUrl: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
        blockExplorer: "https://goerli.etherscan.io/"
      }
};

export const targetNetwork = NETWORKS.goerli;
export const contractAddress = "0x0E700411191DEdb838017B8666eE7aE7C6d1815A";