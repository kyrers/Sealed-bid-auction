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
export const contractAddress = "0x83a4b4010a9cA396a701Da885367E2012F0FF561";