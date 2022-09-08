const mongoose = require('mongoose');

//model
const orderSchema = new mongoose.Schema({
    mediaId: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'Media'
    },
    buyerId: {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isConfirmed: {
        default:false,
        type:Boolean
    },
   
});


const Order = mongoose.model('OrderSchema', orderSchema);
exports.Order = Order

