import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      // Initialize contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(votingContract);

      // Load proposals
      await loadProposals(votingContract);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const loadProposals = async (contractInstance) => {
    try {
      setLoading(true);
      const count = await contractInstance.getProposalCount();
      const proposalsArray = [];

      for (let i = 0; i < count; i++) {
        const proposal = await contractInstance.getProposal(i);
        proposalsArray.push({
          id: i,
          description: proposal.description,
          agreeCount: proposal.agreeCount.toString(),
          disagreeCount: proposal.disagreeCount.toString()
        });
      }

      setProposals(proposalsArray);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProposal = async (description) => {
    try {
      setLoading(true);
      const tx = await contract.addProposal(description);
      await tx.wait();
      await loadProposals(contract);
    } catch (error) {
      console.error('Error adding proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (proposalId, agree) => {
    try {
      setLoading(true);
      const tx = await contract.vote(proposalId, agree);
      await tx.wait();
      await loadProposals(contract);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        proposals,
        loading,
        connectWallet,
        addProposal,
        vote
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context); 