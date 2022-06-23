import { JsonRpcSigner } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import  Header from './components/Header';
import { connect } from './hooks/connect';
import { loadContract } from './hooks/loadContract';
import { targetNetwork } from './config/config';
import './App.css';

function App() {
  const [userSigner, setUserSigner] = useState<JsonRpcSigner | null>();
  const [connectedWallet, setConnectedWallet] = useState("");

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

  return (
    <div className="App">
      <Header name="Auction House" targetNetwork={targetNetwork.name} connectedWallet={connectedWallet} connect={connect}/>
    </div>
  );
}

export default App;
