// client/src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Crowdfunding from './contracts/Crowdfunding.json';
import Header from './components/Header';
import CreateCampaign from './components/CreateCampaign';
import CampaignList from './components/CampaignList';
import './App.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Crowdfunding.networks[networkId];
      if (deployedNetwork) {
        const contractInstance = new web3.eth.Contract(Crowdfunding.abi, deployedNetwork.address);
        setContract(contractInstance);
        loadCampaigns(contractInstance);
      }
    }
  };

  const loadCampaigns = async (contract) => {
    const campaignCount = await contract.methods.campaignCount().call();
    const loadedCampaigns = [];
    for (let i = 1; i <= campaignCount; i++) {
      const campaign = await contract.methods.campaigns(i).call();
      loadedCampaigns.push({ id: i, ...campaign });
    }
    setCampaigns(loadedCampaigns);
  };

  const createCampaign = async (goal, duration) => {
    await contract.methods.createCampaign(goal, duration).send({ from: account });
    loadCampaigns(contract); // reload campaigns after creation
  };

  const donate = async (id) => {
    await contract.methods.donate(id).send({ from: account, value: Web3.utils.toWei('1', 'ether') });
    loadCampaigns(contract); // reload campaigns after donation
  };

  return (
    <div className="App">
      <Header account={account} onConnect={loadBlockchainData} />
      <CreateCampaign createCampaign={createCampaign} />
      <CampaignList campaigns={campaigns} donate={donate} />
    </div>
  );
};

export default App;
