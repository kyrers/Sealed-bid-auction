import { JsonRpcSigner } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { connect } from './hooks/connect';
import { loadContract } from './hooks/loadContract';
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
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
