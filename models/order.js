const mongoose = require('mongoose');

//model
const orderSchema = new mongoose.Schema({
    mediaId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    client: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    desc: {
        required: false,
        type: String
    },
    // must convert to enum
    status: {
        default: 1,
        type: Number
    },
    count: {
        required: true,
        type: Number
    },
    // convert to enum : hour , views
    type: {
        required: true,
        type: Number
    },
    comment: {
        required: true,
        type: String
    },


});


const Order = mongoose.model('Order', orderSchema);
exports.Order = Order

