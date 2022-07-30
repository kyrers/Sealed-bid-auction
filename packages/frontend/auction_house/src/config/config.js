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
export const contractAddress = "0x3e40055F749aA49b2f4a6E8bf88a2B411796D317";