const express = require('express');
const router = express.Router();
const transactionHistoryController = require('../controller/transactionhistory.controller');

// Define route for getting transaction history by UPI ID
router.get('/:upi_id', transactionHistoryController.getTransactionHistoryByUpi);

module.exports = router;