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
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
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
          <div>
            <label>
              Amount to Mint:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
          </div>
        );
      case 1:
        return (
          <div>
            <label>
              Recipient's Ethereum Address:
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </label>
          </div>
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
      <div>
        <Typography>{getStepContent(activeStep)}</Typography>
        <div>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
};

export default MultiStepForm;
