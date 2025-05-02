const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controller/user.controller");
const userModel = require('../model/user.model');

// Fetch User Profile Route - keeping original format for backend compatibility
router.get("/:upi_id", userController.fetchUserProfile);

// Profile route that frontend might be using
router.get("/profile/:upi_id", userController.fetchUserProfile);

// Login route
router.post("/login", [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required")
], userController.loginUser);

// Register route
router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], userController.registerUser);

// Get user details by UPI ID
router.get("/details/:upi_id", userController.fetchUserDetailsByUpi);

// Get user by UPI ID - added from the second code snippet
router.get('/user/:upi_id', async (req, res) => {
  try {
    const { upi_id } = req.params;
    
    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID is required', userExists: false });
    }
    
    const user = await userModel.findOne({ upi_id: upi_id.trim() });
    
    if (user) {
      return res.status(200).json({ 
        message: 'User found', 
        userExists: true, 
        user: { upi_id: user.upi_id } // Return minimal user info for security
      });
    } else {
      return res.status(404).json({ message: 'User not found', userExists: false });
    }
  } catch (err) {
    console.error('Error finding user:', err);
    return res.status(500).json({ message: 'Server error', userExists: false });
  }
});

module.exports = router;