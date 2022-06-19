export const INFURA_ID = "YOUR_INFURA_ID";

export const NETWORKS = {
    localhost: {
        name: "localhost",
        color: "#666666",
        chainId: 31337,
        blockExplorer: "",
        rpcUrl: "http://" + window.location.hostname + ":8545",
    }
}

export const targetNetwork = NETWORKS.localhost;
export const contractAddress = "YOUR_CONTRACT_ADDRESS";