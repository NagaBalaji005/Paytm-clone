import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/Context";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { users } = useContext(AuthContext);
  
  // ✅ Fetch profile data
  const fetchProfile = async () => {
    if (!users?.upi_id) {
      console.error("❌ UPI ID is missing.");
      setError("User information not found. Please log in again.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `http://localhost:3000/user/profile/${users.upi_id}`;

      const response = await axios.get(apiUrl);
      if (response.data) {
        setProfile(response.data.user);
        console.log("✅ Profile fetched successfully:", response.data.user);
      } else {
        console.warn("⚠️ No profile data received.");
        setError("Could not load profile data. Please try again.");
      }
    } catch (error) {
      console.error(
        "❌ Error fetching profile:",
        error.response?.data || error.message
      );
      setError("Failed to load profile. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users?.upi_id) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [users]);

  // ✅ Handle Add Money
  const handleAddMoney = async () => {
    const numericAmount = parseFloat(amount);

    if (!numericAmount || numericAmount <= 0) {
      alert("⚠️ Please enter a valid amount");
      return;
    }

    try {
      console.log(`💰 Adding ₹${numericAmount} to UPI ID: ${users.upi_id}`);

      const response = await axios.post(
        "http://localhost:3000/wallet/add-money",
        {
          upi_id: users.upi_id,
          amount: numericAmount,
        }
      );

      if (response.status === 200) {
        alert(response.data.message || "✅ Money added successfully!");
        await fetchProfile(); // ✅ Re-fetch profile after adding money
        setAmount("");
      } else {
        alert(response.data.message || "⚠️ Failed to add money");
      }
    } catch (error) {
      console.error(
        "❌ Error adding money:",
        error.response?.data || error.message
      );
      alert("❌ An error occurred while adding money. Please try again.");
    }
  };

  if (!users) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-bold text-gray-700">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-bold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-bold text-red-600 mb-4">
          ⚠️ {error || "Error loading profile. Please try again."}
        </p>
        <button 
          onClick={fetchProfile} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md mb-5">
      <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>
      
      {/* Profile Information - Improved Structure */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center border-b pb-2">
          <span className="w-1/3 font-semibold">Name:</span>
          <span className="w-2/3">{profile.name}</span>
        </div>
        <div className="flex items-center border-b pb-2">
          <span className="w-1/3 font-semibold">Balance:</span>
          <span className="w-2/3">₹{profile.balance || 0}</span>
        </div>
        <div className="flex items-center border-b pb-2">
          <span className="w-1/3 font-semibold">UPI ID:</span>
          <span className="w-2/3">{profile.upi_id}</span>
        </div>
        <div className="flex items-center border-b pb-2">
          <span className="w-1/3 font-semibold">Email:</span>
          <span className="w-2/3">{profile.email}</span>
        </div>
      </div>

      {/* Add Money Section - Improved UI */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-3">Add Money</h2>
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">₹</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full pl-7 border border-gray-300 rounded-lg p-2"
          />
        </div>
        <button
          onClick={handleAddMoney}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Money
        </button>
      </div>
      
      {/* Transaction History Link */}
      <div className="mt-5 text-center">
        <a href="/transaction-history" className="text-blue-500 hover:text-blue-700 font-medium">
          View Transaction History
        </a>
      </div>
    </div>
  );
};

export default Profile;
