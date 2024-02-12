import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { ethers } from 'ethers';
import CircularProgress from '@mui/material/CircularProgress';

const steps = ['Step 1: Mint Tokens', 'Step 2: Transfer Tokens'];

const tokenAddress = '0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd';
import erc20ABI from '../contracts/erc20ABI.json';

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  

  const handleNext = async () => {
    if (activeStep === 0) {
      await handleMintTokens();
    } else if (activeStep === 1) {
      await handleTransferTokens();
    }
  };
  
  const handleMintTokens = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid number greater than zero.');
      return;
    }
  
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.mint(ethers.parseUnits(amount, 'ether'));
      await tx.wait();
  
      setSuccess('Tokens minted successfully!');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      setError(`Transaction failed: ${error.message}`);
    }
    finally {
      setLoading(false);
    }
  };
  
  const handleTransferTokens = async () => {
    try {
      setError('')
      setSuccess('')
      if (!ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.transfer(recipientAddress, ethers.parseUnits(amount, 'ether'));
      await tx.wait();
  
      setSuccess('Tokens transferred successfully!');
      setError('');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (err) {
      setSuccess('')
      setError(`Error transferring tokens: ${err.message}`);
    }
    finally {
      setLoading(false);
    }
  };
  
  const getContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(tokenAddress, erc20ABI, signer);
    } else {
      throw new Error('Ethereum object not found, install MetaMask.');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('')
    setSuccess('')
    setAmount('')
    setRecipientAddress('')
  };

  const handleReset = () => {
    setActiveStep(0);
    setError('')
    setSuccess('')
    setAmount('')
    setRecipientAddress('')
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
            <label className="block mb-4">
              <span className="text-gray-700">Amount to Mint:</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
        );
      case 1:
        return (
            <label className="block mb-4">
              <span className="text-gray-700">Recipient&apos;s Ethereum Address:</span>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
        );
      case 2:
          return(
               <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>

          )
      default:
        return 'Unknown stepIndex';
    }
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form className="max-w-lg mx-auto p-8 bg-white rounded-md shadow-md">
        <Typography>{getStepContent(activeStep)}</Typography>
        <div className="flex justify-between mt-4">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button color="primary" onClick={activeStep === steps.length - 1 ? handleNext : activeStep === 0 ? handleNext : handleReset}>
              {activeStep === 0 ? 'Mint Tokens' : activeStep === 1 ? 'Transfer Tokens' : 'Reset'}
            </Button>

        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {loading && <CircularProgress  />}
      </form>
    </div>
  );
};
export default MultiStepForm;
