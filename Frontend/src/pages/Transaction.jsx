import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/Context';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transaction = () => {
  const [receiver_upi_id, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const { users } = useContext(AuthContext);

  // Add a check to prevent errors when users is null
  const sender_upi_id = users?.upi_id;

  const validateReceiver = async (upi_id) => {
    console.log(`🔍 Validating receiver for UPI ID: ${upi_id}`);
    try {
      // Make sure the UPI ID is properly trimmed
      const trimmedUpiId = upi_id.trim();
      
      if (!trimmedUpiId) {
        return false;
      }
      
      const response = await axios.get(`http://localhost:3000/user/${trimmedUpiId}`);
      
      // Check that response data has the expected structure
      if (response.data && typeof response.data.userExists === 'boolean') {
        return response.data.userExists;
      } else if (response.data && response.data.user) {
        // Alternative structure - if API returns the user object directly
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error validating receiver:', error);
      return false;
    }
  };

  const handleTransaction = async () => {
    if (!sender_upi_id) {
      setError('You must be logged in to send money');
      return;
    }

    if (!receiver_upi_id || !amount || !otp) {
      setError('All fields are required');
      return;
    }
    
    // Validate receiver before proceeding
    setLoading(true);
    const receiverExists = await validateReceiver(receiver_upi_id);
    
    if (!receiverExists) {
      setLoading(false);
      setError('Receiver UPI ID does not exist');
      return;
    }
    
    try {
      setError('');
      const response = await axios.post('http://localhost:3000/transaction', {
        sender_upi_id,
        receiver_upi_id: receiver_upi_id.trim(),
        amount: parseFloat(amount),
        otp,
      });
      
      toast.success(response.data.message || 'Transaction successful');
      setAmount('');
      setUpiId('');
      setOtp('');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Transaction failed');
      toast.error(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!sender_upi_id) {
      setError('You must be logged in to send money');
      return;
    }
    
    if (!receiver_upi_id) {
      setError('Receiver UPI ID is required to send OTP');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('A valid amount is required to send OTP');
      return;
    }
    
    try {
      setLoadingOtp(true);
      setError('');
      const response = await axios.post('http://localhost:3000/otp', {
        upi_id: sender_upi_id,
        amount: parseFloat(amount)
      });
      
      toast.success(response.data.message || 'OTP sent successfully');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to send OTP');
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoadingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Send Money</h1>

        <div className="mb-4">
          <label htmlFor="upi_id" className="block text-sm font-medium text-gray-700 mb-1">Receiver UPI ID</label>
          <input
            id="upi_id"
            type="text"
            placeholder="Enter UPI ID"
            value={receiver_upi_id}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            id="amount"
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
          <input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex gap-4">
          <button
            onClick={sendOtp}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1"
            disabled={loadingOtp}
          >
            {loadingOtp ? 'Sending...' : 'Send OTP'}
          </button>
          
          <button
            onClick={handleTransaction}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1"
            disabled={loading || !receiver_upi_id || !amount || !otp}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transaction;