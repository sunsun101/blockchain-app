import React, { useState } from 'react';
import { ethers } from 'ethers';
import erc20ABI from '../contracts/erc20ABI.json';

const tokenAddress = '0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd';

export default function MintForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Ensure the input is numeric and greater than 0
    if (!isNaN(value) && Number(value) > 0) {
      setAmount(value);
      setMessage(''); // Clear message
    } else {
      setMessage('Please enter a valid number greater than zero.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) {
      setMessage('Please enter an amount.');
      return;
    }

    try {
      // Ensure window.ethereum is available
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);

        // Call the mint function from the contract
        const tx = await contract.mint(signer.getAddress(), ethers.utils.parseUnits(amount, 'ether'));
        await tx.wait();

        setMessage('Tokens minted successfully!');
        // Proceed to the next step or handle success state
      } else {
        setMessage('Ethereum object not found, install MetaMask.');
      }
    } catch (error) {
      setMessage(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input type="text" value={amount} onChange={handleInputChange} />
        </label>
        <button type="submit">Mint Tokens</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
      




