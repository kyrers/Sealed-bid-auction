import { JsonRpcSigner } from '@ethersproject/providers';
import { connect } from './hooks/connect';
import { loadContract } from './hooks/loadContract';
import { targetNetwork } from './config/config';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import MainPanel from './components/MainPanel';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';

function App() {
  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [auctionCreator, setAuctionCreator] = useState("");
  const [connectedWallet, setConnectedWallet] = useState("");
  const [auctionEnd, setAuctionEnd] = useState(0);
  const [openBidDeadline, setOpenBidDeadline] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");

  //Connect user wallet
  useEffect(() => {
    async function promptConnect() {
      const { signer, signerAddress } = await connect();
      setUserSigner(signer);
      setConnectedWallet(signerAddress);
    }
    promptConnect();
  }, []);

  useEffect(() => {
    function handleAuctionEndReached() {
      setAuctionEnd(0);
      window.clearTimeout(id);
      window.location.reload();
    }

    if (auctionEnd !== 0) {
      var id = window.setTimeout(() => handleAuctionEndReached(), 10000);
    }
  }, [auctionEnd]);

  useEffect(() => {
    function handleOpenBidDeadlineReached() {
      setOpenBidDeadline(0);
      window.clearTimeout(id);
      window.location.reload();
    }
    var id = window.setTimeout(() => handleOpenBidDeadlineReached(), 20000);
  }, [openBidDeadline]);

  //Listen to wallet changes
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  const auctionHouseContract = loadContract(userSigner);

  //Listen to events
  if (auctionHouseContract != null && auctionHouseContract.provider != null) {
    auctionHouseContract.on("AuctionStarted", async (auctionEnd, openBidDeadline) => {
      console.log("AUCTION STARTED EVENT");
      var address = await userSigner?.getAddress() ?? "";
      setAuctionEnd(auctionEnd);
      setOpenBidDeadline(openBidDeadline);
      setAuctionCreator(address);
      getHighestBid();
      getHighestBidder();
    });

    auctionHouseContract.on("Withdrawal", () => {
      getHighestBid();
      getHighestBidder();
    });
  }

  //Contract interactions
  async function startAuction(_duration: number) {
    await auctionHouseContract.startAuction(_duration);
  }

  async function placeBid(_bid: number) {
    await auctionHouseContract.placeBid({ value: ethers.utils.parseEther(_bid.toString()) });
  }

  async function openBid() {
    await auctionHouseContract.openBid();
  }

  async function getHighestBid() {
    setHighestBid(await auctionHouseContract.highestBid());
  }

  async function getHighestBidder() {
    setHighestBidder(await auctionHouseContract.highestBidder());
  }

  return (
    <div className="App">
      <Header name="Auction House" targetNetwork={targetNetwork.name} connectedWallet={connectedWallet} connect={connect} />
      <MainPanel auctionCreator={auctionCreator} auctionEnd={auctionEnd} openBidDeadline={openBidDeadline} highestBid={highestBid} highestBidder={highestBidder}
        startAuction={(_duration) => startAuction(_duration)} placeBid={(_bid) => placeBid(_bid)} openBid={() => openBid()} />
    </div>
  );
}

export default App;
