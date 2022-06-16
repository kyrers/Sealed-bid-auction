const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Auction House", function () {
  let factory;
  let contract;

  beforeEach(async function () {
    factory = await ethers.getContractFactory("AuctionHouse");
    contract = await factory.deploy();
  });


  describe("### DEPLOYMENT ###", function () {
    it("Should set owner to msg.sender", async function () {
      const [owner] = await ethers.getSigners();
      const contractOwner = await contract.owner();

      expect(owner.address).to.equal(contractOwner);
    });
  });

  describe("### START AUCTION ###", function () {
    it("Should start an auction with the correct parameters", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      const startAuctionTxReceipt = await startAuctionTx.wait();

      const auctionEnd = startAuctionTxReceipt.events[0].args[0];
      const openBidDeadline = startAuctionTxReceipt.events[0].args[1];

      const highestBidder = await contract.highestBidder();
      const highestBid = await contract.highestBid();
      
      var block = await ethers.provider.getBlock(startAuctionTxReceipt.blockNumber);
      var blockTimestamp = block.timestamp;
      var auctionEndDate = new Date(auctionEnd * 1000);
      var expectedEndDate = new Date(new Date(blockTimestamp * 1000).getTime() + 1 * 60000);

      assert.deepEqual(expectedEndDate, auctionEndDate);
      expect(highestBid).to.equal(0);
      expect(highestBidder).to.hexEqual('0x');
    });

    it("Should not start an auction because it's not the contract owner", async function () {
      const [owner, signer] = await ethers.getSigners();

      await expect(contract.connect(signer).startAuction(1)).to.be.reverted;    
    });
  

    it("Should not start an auction because there's one already live", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      const startAuctionTxReceipt = await startAuctionTx.wait();

      await expect(contract.startAuction(1)).to.be.reverted;    
    });
  });
});