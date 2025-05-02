const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    upi_id: {type: String, required: true, unique: true},
    balance: {type: Number, default: 0}
}, {
    timestamps: true // Add timestamps for better tracking
});

userSchema.methods.generateAuthToken = function(){
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not set");
    }
    
    const token = jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: '7d' // Adding expiration for security
    });
    
    return token;
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;