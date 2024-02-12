import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { ethers } from 'ethers';

const steps = ['Step 1: Mint Tokens', 'Step 2: Transfer Tokens'];

const tokenAddress = '0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd';
import erc20ABI from '../contracts/erc20ABI.json';

const MultiStepForm = ({ mintTokens, transferTokens }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNext = async () => {
    if (activeStep === 0) {
      // Step 1: Mint Tokens
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Please enter a valid number greater than zero.');
        return;
      }

      try {
        if (window.ethereum) {
          console.log("Ethereum",window.ethereum)
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log("Provider",provider);
          const signer = provider.getSigner();
          console.log("Signer",signer);
          const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);

          const tx = await contract.mint(signer.getAddress(), ethers.utils.parseUnits(amount, 'ether'));
          await tx.wait();

          setSuccess('Tokens minted successfully!');
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setError('Ethereum object not found, install MetaMask.');
        }
      } catch (error) {
        setError(`Transaction failed: ${error.message}`);
      }
    } else if (activeStep === 1) {
      // Step 2: Transfer Tokens
      try {
        
        // await transferTokens(recipientAddress);
        setSuccess('Tokens transferred successfully!');
        setError('');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (err) {
        setError('Error transferring tokens. Please try again.');
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
      <form className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <Typography>{getStepContent(activeStep)}</Typography>
        <div className="flex justify-between mt-4">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button  color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default MultiStepForm;
