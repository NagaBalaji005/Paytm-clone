const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/Transaction.routes');
const transactionHistoryRoutes = require('./routes/transactionhistory.routes');

// Route logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Connect to database
connectToDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: "Paytm Clone API is running",
        status: "OK"
    });
});

// Routes
app.use('/user', userRoutes);
app.use('/', transactionRoutes);  // Keep this as root to match original structure
app.use('/transactionhistory', transactionHistoryRoutes);

// 404 handler
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!", 
        error: process.env.NODE_ENV === 'production' ? null : err.message 
    });
});

module.exports = app;