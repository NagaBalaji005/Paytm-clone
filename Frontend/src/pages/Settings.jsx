// src/pages/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferences, setPreferences] = useState({
    notifications: false,
    darkMode: false,
  });
  const [upi, setUpi] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Simulate an API call
    setTimeout(() => {
      setSuccessMessage('Settings updated successfully!');
    }, 1000);
  };

  // Handle preferences change
  const handlePreferencesChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: checked,
    }));
  };

  return (
    <div className="settings-page max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email and Password Settings */}
        <div>
          <label className="block text-gray-700 font-medium">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Current Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter your new password"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Confirm your new password"
          />
        </div>

        {/* Preferences Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">User Preferences</h3>
          <div className="space-y-4 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notifications"
                checked={preferences.notifications}
                onChange={handlePreferencesChange}
                className="h-5 w-5 text-blue-600"
              />
              <label className="ml-3 text-gray-700">Enable Notifications</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="darkMode"
                checked={preferences.darkMode}
                onChange={handlePreferencesChange}
                className="h-5 w-5 text-blue-600"
              />
              <label className="ml-3 text-gray-700">Enable Dark Mode</label>
            </div>
          </div>
        </div>

        {/* UPI & Payment Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mt-6">UPI & Payment Settings</h3>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">UPI ID</label>
            <input
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter your UPI ID"
            />
          </div>
        </div>

        {/* Link Bank Account */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mt-6">Link Bank Account</h3>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Bank Account Number</label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter your bank account number"
            />
          </div>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mt-6">Help & Support</h3>
          <div className="mt-4">
            <p className="text-gray-700">If you need any assistance, please reach out to our support team.</p>
            <button
              type="button"
              className="mt-3 text-blue-600 hover:text-blue-800"
              onClick={() => alert('Contact Support')}
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
