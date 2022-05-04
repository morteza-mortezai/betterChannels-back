const mongoose = require('mongoose');
const {schema}=require('./secure/userValidation')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    fullName: String,
    phone: String,
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    password: {
        type: String,
        required: true
    }
});
// static validation
userSchema.static.userValidation=function(body){
return schema.validate(body,{abortEarly:false})
}

const User = mongoose.model('User', userSchema);
exports.User = User

