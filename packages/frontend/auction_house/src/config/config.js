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
export const contractAddress = "0xb3569F147b70B3ec72A2B9a16856ae15B7a57f00";