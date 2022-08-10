const { ethers } = require("hardhat");

async function main() {
    //Get the contract to deploy
    const factory = await ethers.getContractFactory("AuctionHouse");
    const contract = await factory.deploy();
    await contract.deployed();
  
    console.log("Auction House deployed to:", contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });