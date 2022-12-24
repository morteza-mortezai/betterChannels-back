const mongoose = require('mongoose');

//model
const verificationSchema = new mongoose.Schema({
    emailPhone: {
        required: true,
        type: String,
        unique: true
    },
    randomNumber: { type: String, required: true },
    expireAt: {
        type: Date,
        default: new Date(),
        expires: 300,
    }
});

const Verification = mongoose.model('Verification', verificationSchema);
exports.Verification = Verification

