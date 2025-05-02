const userModel = require('../model/user.model');

module.exports.createUser = async ({
  name,
  email,
  password,
  upi_id,
  balance,
}) => {
  if (!name || !email || !password) {
    throw new Error("Required fields are missing");
  }

  // Set default balance if not provided
  const userBalance = balance !== undefined ? balance : 0;

  // Create the user
  try {
    const user = await userModel.create({
      name,
      email,
      password,
      upi_id,
      balance: userBalance,
    });
    
    return user;
  } catch (error) {
    // Handle duplicate key errors more gracefully
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        throw new Error("Email is already registered");
      }
      if (error.keyPattern?.upi_id) {
        throw new Error("UPI ID is already in use");
      }
    }
    throw error;
  }
};
