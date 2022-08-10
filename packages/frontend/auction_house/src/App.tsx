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
      window.clearTimeout(id);
      window.location.reload();
    }

    if (ethers.BigNumber.from(auctionEnd).toNumber() !== 0) {
      var delay = new Date(ethers.BigNumber.from(auctionEnd * 1000).toNumber()).getTime() - Date.now();
      var id = window.setTimeout(() => handleAuctionEndReached(), delay);
    }
  }, [auctionEnd]);

  useEffect(() => {
    function handleOpenBidDeadlineReached() {
      window.clearTimeout(id);
      window.location.reload();
    }

    if (ethers.BigNumber.from(openBidDeadline).toNumber() !== 0) {
      var delay = new Date(ethers.BigNumber.from(openBidDeadline * 1000).toNumber()).getTime() - Date.now();
      var id = window.setTimeout(() => handleOpenBidDeadlineReached(), delay);
    }
  }, [openBidDeadline]);

  //Listen to wallet changes
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  const auctionHouseContract = loadContract(userSigner);

  //Listen to events
  if (auctionHouseContract != null && auctionHouseContract.provider != null) {
    ethers.providers.getDefaultProvider().once("block", () => {
      auctionHouseContract.on("AuctionStarted", async (_auctionEnd, _openBidDeadline) => {
        var address = await userSigner?.getAddress() ?? "";
        var currentDate = new Date();
        var auctionEndDate = new Date(ethers.BigNumber.from(_auctionEnd * 1000).toNumber());
        var openBidDeadlineDate = new Date(ethers.BigNumber.from(_openBidDeadline * 1000).toNumber());

        if (auctionEndDate >= currentDate && ethers.BigNumber.from(_auctionEnd).toNumber() > auctionEnd) {
          setAuctionEnd(_auctionEnd);
        }

        if (openBidDeadlineDate >= currentDate && ethers.BigNumber.from(_openBidDeadline).toNumber() > openBidDeadline) {
          setOpenBidDeadline(_openBidDeadline);
        }

        setAuctionCreator(address);
        getHighestBid();
        getHighestBidder();
      });

      auctionHouseContract.on("Withdrawal", () => {
        getHighestBid();
        getHighestBidder();
      });
    })
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
