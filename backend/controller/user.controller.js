const userModel = require("../model/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

/**
 * ✅ Utility Function: Format Balance in INR
 */
const formatBalance = (balance) => {
  // Handle undefined or null values
  if (balance === undefined || balance === null) {
    console.log('⚠️ Warning: Attempting to format undefined/null balance');
    balance = 0;
  }
  
  // Ensure balance is a number
  balance = parseFloat(balance);
  if (isNaN(balance)) {
    balance = 0;
  }
  
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(balance);
};

/**
 * ✅ Fetch User Profile by UPI ID
 */
module.exports.fetchUserProfile = async (req, res) => {
  try {
    const { upi_id } = req.params;
    console.log(`🔍 Attempting to fetch profile for UPI: ${upi_id}`);
    
    if (!upi_id) {
      console.log('❌ Error: UPI ID is missing in request params');
      return res.status(400).json({ message: "UPI ID is required" });
    }

    const user = await userModel.findOne({ upi_id }).select("-password").lean();
    console.log(`🔎 User found: ${!!user}`, user ? `(Name: ${user.name})` : '');

    if (!user) {
      console.log(`❌ No user found with UPI ID: ${upi_id}`);
      return res.status(404).json({ message: "User not found with this UPI ID" });
    }

    // ✅ Ensure balance is properly formatted
    user.formattedBalance = formatBalance(user.balance);
    console.log(`✅ Successfully fetched profile for: ${user.name}, Balance: ${user.formattedBalance}`);

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

/**
 * ✅ Register a New User
 */
module.exports.registerUser = async (req, res) => {
  try {
    console.log('📝 Attempting to register new user');
    
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    console.log(`📧 Registration attempt for email: ${email}`);

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log(`⚠️ Email already registered: ${email}`);
      return res.status(400).json({ message: "Email is already registered" });
    }

    // ✅ Generate unique UPI ID
    const generateUpi = () => `${crypto.randomBytes(4).toString("hex")}@paytm`;
    let upiId = generateUpi();
    
    // Make sure UPI ID is unique
    let existingUpi = await userModel.findOne({ upi_id: upiId });
    while (existingUpi) {
      upiId = generateUpi();
      existingUpi = await userModel.findOne({ upi_id: upiId });
    }
    
    console.log(`🆔 Generated UPI ID: ${upiId}`);

    // ✅ Hash Password
    const hashedPassword = await userModel.hashPassword(password);

    // ✅ Create User
    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      upi_id: upiId,
      balance: 1000, // ✅ Initial balance
    });
    
    console.log(`✅ User created successfully: ${user.name}, ID: ${user._id}`);

    const token = user.generateAuthToken();

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        upi_id: user.upi_id,
        balance: user.balance,
        formattedBalance: formatBalance(user.balance),
      },
    });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

/**
 * ✅ User Login
 */
module.exports.loginUser = async (req, res) => {
  try {
    console.log('🔑 Login attempt initiated');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Login validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`📧 Login attempt for email: ${email}`);

    // ✅ Find user with email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`❌ Password mismatch for user: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`✅ Login successful for user: ${user.name}`);
    const token = user.generateAuthToken();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        upi_id: user.upi_id,
        balance: user.balance,
        formattedBalance: formatBalance(user.balance),
      },
    });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

/**
 * ✅ Fetch User Details by UPI ID
 */
module.exports.fetchUserDetailsByUpi = async (req, res) => {
  try {
    const { upi_id } = req.params;
    console.log(`🔍 Fetching user details for UPI: ${upi_id}`);

    if (!upi_id) {
      console.log('❌ Error: UPI ID is missing in request params');
      return res.status(400).json({ message: "UPI ID is required" });
    }

    const user = await userModel.findOne({ upi_id }).select("-password").lean();
    console.log(`🔎 User details found: ${!!user}`);

    if (!user) {
      console.log(`❌ No user found with UPI ID: ${upi_id}`);
      return res.status(404).json({ message: "User not found with this UPI ID" });
    }

    // Format balance
    user.formattedBalance = formatBalance(user.balance);
    console.log(`✅ Successfully fetched details for: ${user.name}, Balance: ${user.formattedBalance}`);

    return res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (err) {
    console.error("❌ Error fetching user details:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};