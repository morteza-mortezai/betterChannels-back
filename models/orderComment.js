const mongoose = require('mongoose');

//model
const orderCommentSchema = new mongoose.Schema({
    orderId: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'Order'
    },
    text: {
        type:String,
        required:true
    },
   
},{timestamps:true});


const OrderComment = mongoose.model('OrderComment', orderCommentSchema);
exports.OrderComment = OrderComment

