const mongoose = require('mongoose');
const { regSchema } = require('./secure/user/userReg')
const { loginSchema } = require('./secure/user/userLogin')
//model
const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: false, unique: false },
    isVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER',
        required: false
    }
});
// static validation
userSchema.statics.userRegValidation = function (body) {
    return regSchema.validate(body, { abortEarly: false })
}

userSchema.statics.userLoginValidation = function (body) {
    return loginSchema.validate(body, { abortEarly: false })
}

const User = mongoose.model('User', userSchema);
exports.User = User

