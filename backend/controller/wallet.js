const userModel = require('../model/user.model');

module.exports.addMoney = async function (req, res) {
    const { upi_id, amount } = req.body;
    const MAX_AMOUNT = 10000;

    try {
        console.log("Add money request:", { upi_id, amount });
        
        if (!upi_id) {
            return res.status(400).json({ message: "UPI ID is required" });
        }

        const numericAmount = Number(amount);

        if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (numericAmount > MAX_AMOUNT) {
            return res.status(400).json({ message: `Maximum amount limit is ₹${MAX_AMOUNT}` });
        }

        const user = await userModel.findOne({ upi_id: upi_id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Ensure correct balance update with proper type conversion
        const currentBalance = parseFloat(user.balance) || 0;
        user.balance = currentBalance + numericAmount;
        console.log(`Updating balance from ${currentBalance} to ${user.balance}`);

        await user.save();

        // Format the balance for display
        const formattedBalance = new Intl.NumberFormat("en-IN", { 
            style: "currency", 
            currency: "INR" 
        }).format(user.balance);

        return res.status(200).json({ 
            message: "Money added successfully", 
            balance: user.balance,
            formattedBalance: formattedBalance 
        });
    } catch (error) {
        console.error("Error adding money:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};