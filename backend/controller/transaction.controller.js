const transactionModel = require('../model/Transaction');
const userModel = require('../model/user.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpCache = new Map();

module.exports.requestOtp = async (req, res) => {
  try {
    const { upi_id } = req.body;

    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }

    const user = await userModel.findOne({ upi_id });

    if (!user || !user.email) {
        return res.status(400).json({ message: 'User not found or invalid email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated OTP for ${upi_id}: ${otp}`);
    
    // Clear any existing OTP for this UPI ID
    if (otpCache.has(upi_id)) {
      otpCache.delete(upi_id);
    }
    
    otpCache.set(upi_id, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Transaction OTP',
      text: `Your OTP for the transaction is ${otp}. It is valid for 5 minutes.`,
    });

    setTimeout(() => {
      if (otpCache.has(upi_id)) {
        otpCache.delete(upi_id);
        console.log(`OTP for ${upi_id} expired`);
      }
    }, 300000); // 5 minutes expiry

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

module.exports.makeTransaction = async (req, res) => {
  try {
    const { sender_upi_id, receiver_upi_id, amount, otp } = req.body;
    console.log('Transaction request received:', { sender_upi_id, receiver_upi_id, amount, otp });
    console.log(`Sender UPI ID: ${sender_upi_id}, Receiver UPI ID: ${receiver_upi_id}`);

    if (!sender_upi_id || !receiver_upi_id || !amount || !otp) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (sender_upi_id === receiver_upi_id) {
      return res.status(400).json({ message: 'Sender and receiver cannot be the same' });
    }

    // Convert amount to number to ensure proper comparison
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const sender = await userModel.findOne({ upi_id: sender_upi_id });
    const receiver = await userModel.findOne({ upi_id: receiver_upi_id });

    if (!sender) return res.status(404).json({ message: 'Sender not found. Please check the sender UPI ID.' });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found. Please check the receiver UPI ID.' });

    if (sender.balance < numericAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Ensure OTP is parsed as integer for comparison
    const parsedOtp = parseInt(otp, 10);
    const cachedOtp = otpCache.get(sender_upi_id);
    
    if (!cachedOtp || cachedOtp !== parsedOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update balances with proper type conversion
    sender.balance = parseFloat(sender.balance) - numericAmount;
    receiver.balance = parseFloat(receiver.balance) + numericAmount;

    // Use a transaction to ensure data consistency
    const session = await userModel.startSession();
    session.startTransaction();
    
    try {
      await sender.save({ session });
      await receiver.save({ session });
      
      const transaction = await transactionModel.create([{
        sender_upi_id,
        receiver_upi_id,
        amount: numericAmount,
        timestamp: new Date(),
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      otpCache.delete(sender_upi_id);
      
      res.status(200).json({
        message: 'Transaction successful',
        transaction: transaction[0],
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error('Error making transaction:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

module.exports.getTransactionsByUpi = async (req, res) => {
  try {
    const { upi_id } = req.params;

    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }

    const transactions = await transactionModel.find({ 
      $or: [
        { sender_upi_id: upi_id },
        { receiver_upi_id: upi_id }
      ]
    }).sort({ timestamp: -1 }); // Sort by newest first

    res.status(200).json({
      message: transactions.length ? 'Transactions fetched successfully' : 'No transactions found',
      transactions,
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};