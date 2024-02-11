// components/MintForm.js
import { useState } from 'react';

const MintForm = ({ mintTokens }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid number greater than zero.');
      return;
    }

    // Call mintTokens function (replace this with your actual function)
    try {
      await mintTokens(parsedAmount);
      setSuccess('Tokens minted successfully!');
      setAmount('');
      setError('');
    } catch (err) {
      setError('Error minting tokens. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Amount to Mint:
        <input type="number" value={amount} onChange={handleAmountChange} />
      </label>
      <button type="submit">Mint Tokens</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default MintForm;
