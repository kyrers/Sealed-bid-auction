import { JsonRpcSigner } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
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
      <header className="App-header">
        <h1>Auction House</h1>
        <h5 className="header-target-network">{targetNetwork.name}</h5>
        <Button onClick={connect}>
          {
            connectedWallet !== "" ?
              <span>{connectedWallet}</span>
              :
              <span>Connect</span>
          }
        </Button>
      </header>
    </div>
  );
}

export default App;
