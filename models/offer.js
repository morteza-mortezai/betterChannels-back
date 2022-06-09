const mongoose = require('mongoose');
const { schema } = require('./secure/userRegValidation')
//model
const offerSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    mediaId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'Media'
    },
    type: {
        type: String, required: true, enum: ['per', 'temp', 'byView'],
        default: 'normal'
    },
    pos: {
        type: String, required: true, enum: ['lastPost', 'oneToLast', 'normal'],
        default: 'normal'
    },
    dur: {
        type: Number,
        default: -1
    },
    view: {
        type: Number,
        default: -1
    },
    minOrder: {
        type: Number,
        default: -1
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }

});
// static validation
offerSchema.statics.newOfferValidation = function (body) {
    return schema.validate(body, { abortEarly: false })
}

const Offer = mongoose.model('Offer', offerSchema);
exports.Offer = Offer

