const mongoose = require('mongoose');
const { schema } = require('./secure/user/userReg')
//model
const mediaTypeSchema = new mongoose.Schema({
    name: {
        required:true,
        type: String,
        unique: true
    },
   
});


const MediaType = mongoose.model('MediaType', mediaTypeSchema);
exports.MediaType = MediaType

