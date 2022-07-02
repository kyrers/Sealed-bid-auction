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
  const [connectedWallet, setConnectedWallet] = useState("");
  const [auctionEnd, setAuctionEnd] = useState(0);
  const [openBidDeadline, setOpenBidDeadline] = useState(0);

  //Connect user wallet
  useEffect(() => {
    async function promptConnect() {
      const { signer, signerAddress } = await connect();
      setUserSigner(signer);
      setConnectedWallet(signerAddress);
    }
    promptConnect();
  }, []);

  //Listen to wallet changes
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  const auctionHouseContract = loadContract(userSigner);

  //Listen to events
  if (auctionHouseContract != null && auctionHouseContract.provider != null) {
    auctionHouseContract.on("AuctionStarted", (auctionEnd, openBidDeadline) => {
      setAuctionEnd(auctionEnd);
      setOpenBidDeadline(openBidDeadline);
    });
  }

  //Contract interactions
  async function startAuction(_duration: number) {
    await auctionHouseContract.startAuction(_duration);
  }

  return (
    <div className="App">
      <Header name="Auction House" targetNetwork={targetNetwork.name} connectedWallet={connectedWallet} connect={connect}/>
      <MainPanel auctionEnd={auctionEnd} openBidDeadline={openBidDeadline} startAuction={(_duration) => startAuction(_duration)} />
    </div>
  );
}

export default App;
