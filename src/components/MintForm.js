import { useState } from 'react';
import { ethers } from 'ethers';
import erc20ABI from '../contracts/erc20ABI.json';
const tokenAddress = '0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd';

const MintForm = ({ mintTokens }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value) && Number(value) > 0) {
      setAmount(value);
      setError('')
    } else {
      setError('Please enter a valid number greater than zero.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid number greater than zero.');
      return;
    }

    try {

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);


        const tx = await contract.mint(signer.getAddress(), ethers.utils.parseUnits(amount, 'ether'));
        await tx.wait();

        setSuccess('Tokens minted successfully!');
        // Proceed to the next step or handle success state
      } else {
        setError('Ethereum object not found, install MetaMask.');
      }
    } catch (error) {
      setError(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <label className="block mb-4">
        <span className="text-gray-700">Amount to Mint:</span>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
        />
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Mint Tokens
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
};

export default MintForm;
