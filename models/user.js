const mongoose = require('mongoose');
const { schema } = require('./secure/userRegValidation')
//model
const userSchema = new mongoose.Schema({
    email: {
        required:true,
        type: String,
        unique: true
    },
    fullName: { type: String, required: true, default: null },
    phone: { type: String, required: false, default: null },
    active: {
        type: Boolean,
        required: false,
        default: false
    },
    password: {
        type: String,
        required: true
    }
});
// static validation
userSchema.statics.userValidation = function (body) {
    return schema.validate(body, { abortEarly: false })
}

const User = mongoose.model('User', userSchema);
exports.User = User

