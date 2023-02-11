const mongoose = require('mongoose');

//model
const locationSchema = new mongoose.Schema({
    name: {
        required:true,
        type: String,
        unique: true
    },
   
});


const Location = mongoose.model('Location', locationSchema);
exports.Location = Location

