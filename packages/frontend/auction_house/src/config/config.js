export const NETWORKS = {
    localhost: {
        name: "localhost",
        color: "#666666",
        chainId: 31337,
        blockExplorer: "",
        rpcUrl: "http://" + window.location.hostname + ":8545",
    }
};

export const targetNetwork = NETWORKS.localhost;
export const contractAddress = "0x9ce517AC0A4d31DbECA41c289c68fc6812678106";