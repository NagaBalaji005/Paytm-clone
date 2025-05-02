import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/Context';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const { users } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if users exist before accessing properties
    if (!users || !users.upi_id) {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        console.log("Fetching transactions for UPI ID:", users.upi_id);
        
        const response = await axios.get(`http://localhost:3000/transactionhistory/${users.upi_id}`);
        
        if (response.data.transactions && response.data.transactions.length === 0) {
          setError('No transactions found for this UPI ID');
        } else if (response.data.transactions) {
          setTransactions(response.data.transactions);
          setError('');
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Error fetching transactions. Please try again.');
        toast.error('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [users, navigate]);

  // Improved filtering with proper null checks
  const filteredTransactions = transactions.filter((txn) => {
    const senderUpi = txn.sender_upi_id ? txn.sender_upi_id.toLowerCase() : '';
    const receiverUpi = txn.receiver_upi_id ? txn.receiver_upi_id.toLowerCase() : '';
    const searchTerm = search.toLowerCase();
    
    return senderUpi.includes(searchTerm) || receiverUpi.includes(searchTerm);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h1>
        
        <input 
          type="text" 
          placeholder="Search by sender or receiver" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300" 
        />
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No transactions found matching your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border">Date</th>
                  <th className="p-4 border">Sender</th>
                  <th className="p-4 border">Receiver</th>
                  <th className="p-4 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50">
                    <td className="p-4 border">{new Date(txn.timestamp).toLocaleDateString()}</td>
                    <td className="p-4 border">{txn.sender_upi_id || 'N/A'}</td>
                    <td className="p-4 border">{txn.receiver_upi_id || 'N/A'}</td>
                    <td className="p-4 border text-blue-600 font-bold">₹{txn.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;