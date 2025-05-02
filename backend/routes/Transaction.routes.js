const express = require('express');
const router = express.Router();
const transactionController = require('../controller/transaction.controller');
const wallet = require('../controller/wallet');
const { body } = require('express-validator');

// Get transactions for a UPI ID
router.get('/transactions/:upi_id', transactionController.getTransactionsByUpi);

// Make a transaction
router.post('/transaction', [
    body('sender_upi_id').notEmpty().withMessage('Sender UPI ID is required'),
    body('receiver_upi_id').notEmpty().withMessage('Receiver UPI ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('otp').notEmpty().withMessage('OTP is required')
], transactionController.makeTransaction);

// Add money to wallet
router.post('/wallet/add-money', [
    body('upi_id').notEmpty().withMessage('UPI ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number')
], wallet.addMoney);

// Request OTP for transaction
router.post('/otp', [
    body('upi_id').notEmpty().withMessage('UPI ID is required')
], transactionController.requestOtp);

module.exports = router;