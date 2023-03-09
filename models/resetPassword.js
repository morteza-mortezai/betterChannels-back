const mongoose = require('mongoose');

//model
const resetPasswordSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: String,
        unique: true
    },
    token: { type: String, required: true },
    expireAt: {
        type: Date,
        default: new Date(),
        expires: 300,
    }
});

const ResetPassword = mongoose.model('resetPassword', resetPasswordSchema);
exports.ResetPassword = ResetPassword

