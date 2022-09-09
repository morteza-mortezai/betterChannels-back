const mongoose = require('mongoose');

//model
const commentSchema = new mongoose.Schema({
    mediaId: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'Media'
    },
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isBuyer:{
        type:Boolean,
        required:true,
    },
    text:{
        type:String,
        required:true,   
    }
        
},{ timestamps: true });


const Comment = mongoose.model('Comment', commentSchema);
exports.Comment = Comment

