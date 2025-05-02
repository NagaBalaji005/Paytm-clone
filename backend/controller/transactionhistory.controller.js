const transactionModel = require("../model/Transaction");

module.exports.getTransactionHistoryByUpi = async (req, res) => {
  try {
    const { upi_id } = req.params;

    if (!upi_id) {
      return res.status(400).json({ message: "UPI ID is required" });
    }

    const transactions = await transactionModel.find({
      $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }],
    }).sort({ timestamp: -1 }); // Sort by newest first

    return res.status(200).json({ 
      message: transactions.length ? "Transactions fetched successfully" : "No transactions found",
      transactions 
    });
  } catch (err) {
    console.error("Transaction history error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};