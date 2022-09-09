const mongoose = require('mongoose');

//model
const scoreSchema = new mongoose.Schema({
    userId: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mediaId: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    score:{
        required:true,
        type:Number,
        default:0
    }
   
});


const Score = mongoose.model('Score', scoreSchema);
exports.Score = Score

