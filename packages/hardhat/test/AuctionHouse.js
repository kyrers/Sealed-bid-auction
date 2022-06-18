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
      var openBidDeadlineDate = new Date(openBidDeadline * 1000);
      var expectedOpenBidDeadlineDate = new Date(new Date(blockTimestamp * 1000).getTime() + 6 * 60000);

      assert.deepEqual(expectedEndDate, auctionEndDate);
      assert.deepEqual(expectedOpenBidDeadlineDate, openBidDeadlineDate);
      expect(highestBid).to.equal(0);
      expect(highestBidder).to.hexEqual('0x');
    });

    it("Should start a second auction with the correct parameters, given that the open bid deadline of the previous auction has passed", async function () {
      const [owner] = await ethers.getSigners();

      const startFirstAuctionTx = await contract.startAuction(1);
      await startFirstAuctionTx.wait();

      await network.provider.send("evm_increaseTime", [360])
      await network.provider.send("evm_mine");

      const startSecondAuctionTx = await contract.startAuction(1);
      const startSecondAuctionTxReceipt = await startSecondAuctionTx.wait();

      const auctionEnd = startSecondAuctionTxReceipt.events[0].args[0];
      const openBidDeadline = startSecondAuctionTxReceipt.events[0].args[1];

      const highestBidder = await contract.highestBidder();
      const highestBid = await contract.highestBid();
      
      var block = await ethers.provider.getBlock(startSecondAuctionTxReceipt.blockNumber);
      var blockTimestamp = block.timestamp;

      var auctionEndDate = new Date(auctionEnd * 1000);
      var expectedEndDate = new Date(new Date(blockTimestamp * 1000).getTime() + 1 * 60000);
      var openBidDeadlineDate = new Date(openBidDeadline * 1000);
      var expectedOpenBidDeadlineDate = new Date(new Date(blockTimestamp * 1000).getTime() + 6 * 60000);

      assert.deepEqual(expectedEndDate, auctionEndDate);
      assert.deepEqual(expectedOpenBidDeadlineDate, openBidDeadlineDate);
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

      await expect(contract.startAuction(1)).to.be.reverted;    
    });
  });

  describe("### PLACE BID ###", function () {
    it("Should place bid and update the corresponding arrays", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();

      const placeBidTx = await contract.placeBid({value: ethers.utils.parseEther("0.5")});
      const placeBixTxReceipt = await placeBidTx.wait();

      const bidder = placeBixTxReceipt.events[0].args[0];
      const bidderArray = await contract.bidders(0);
      
      expect(bidder).to.equal(owner.address);
      expect(bidderArray).to.equal(owner.address);
    });

    it("Should not place bid because the current auction bidding period has ended", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();

      await network.provider.send("evm_increaseTime", [60]);
      await network.provider.send("evm_mine");

      await expect(contract.placeBid({value: ethers.utils.parseEther("0.5")})).to.be.reverted;
    });

    it("Should not place bid because there's no auction live", async function () {
      const [owner] = await ethers.getSigners();

      await expect(contract.placeBid({value: ethers.utils.parseEther("0.5")})).to.be.reverted;
    });

    it("Should not place bid because no value was sent", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();

      await expect(contract.placeBid()).to.be.reverted;
    });
  });

  describe("### OPEN BID ###", function () {
    it("Should open bid and make it the current highest bid", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();
      const placeBidTx = await contract.placeBid({value: ethers.utils.parseEther("0.5")});
      await placeBidTx.wait();

      await network.provider.send("evm_increaseTime", [60])
      await network.provider.send("evm_mine");

      const openBidTx = await contract.openBid();
      const openBidTxReceipt = await openBidTx.wait();

      const address = openBidTxReceipt.events[0].args[0];
      const amount = openBidTxReceipt.events[0].args[1];

      const highestBidder = await contract.highestBidder();
      const highestBid = await contract.highestBid();

      expect(address).to.equal(owner.address);
      expect(highestBidder).to.equal(owner.address);
      expect(amount).to.equal(ethers.utils.parseEther("0.5"));
      expect(highestBid).to.equal(ethers.utils.parseEther("0.5"));
    });

    it("Should open bid, but it isn't the highest bid", async function () {
      const [owner, signer] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();

      const placeBidTx = await contract.connect(signer).placeBid({value: ethers.utils.parseEther("1")});
      await placeBidTx.wait();
      const ownerPlaceBidTx = await contract.placeBid({value: ethers.utils.parseEther("0.5")});
      await ownerPlaceBidTx.wait();

      await network.provider.send("evm_increaseTime", [60])
      await network.provider.send("evm_mine");

      const openBidTx = await contract.connect(signer).openBid();
      await openBidTx.wait();
      const ownerOpenBidTx = await contract.openBid();
      const ownerOpenBidTxReceipt = await ownerOpenBidTx.wait();

      const address = ownerOpenBidTxReceipt.events[0].args[0];
      const amount = ownerOpenBidTxReceipt.events[0].args[1];

      const highestBidder = await contract.highestBidder();
      const highestBid = await contract.highestBid();
      
      expect(address).to.equal(owner.address);
      expect(highestBidder).to.equal(signer.address);
      expect(amount).to.equal(ethers.utils.parseEther("0.5"));
      expect(highestBid).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should not open bid because no bid was placed", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();

      await network.provider.send("evm_increaseTime", [60]);
      await network.provider.send("evm_mine");

      await expect(contract.openBid()).to.be.reverted;
    });

    it("Should not open bid because it is before the opening period", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();
      const placeBidTx = await contract.placeBid({value: ethers.utils.parseEther("0.5")});
      await placeBidTx.wait();

      await expect(contract.openBid()).to.be.reverted;
    });

    it("Should not open bid because it is after the opening period", async function () {
      const [owner] = await ethers.getSigners();

      const startAuctionTx = await contract.startAuction(1);
      await startAuctionTx.wait();
      const placeBidTx = await contract.placeBid({value: ethers.utils.parseEther("0.5")});
      await placeBidTx.wait();

      await network.provider.send("evm_increaseTime", [360]);
      await network.provider.send("evm_mine");

      await expect(contract.openBid()).to.be.reverted;
    });
  });
});