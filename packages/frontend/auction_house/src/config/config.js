export const NETWORKS = {
    localhost: {
        name: "localhost",
        color: "#666666",
        chainId: 1337,
        blockExplorer: "",
        rpcUrl: "http://" + window.location.hostname + ":8545",
    }
};

export const targetNetwork = NETWORKS.localhost;
export const contractAddress = "0x0E700411191DEdb838017B8666eE7aE7C6d1815A";