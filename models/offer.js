const mongoose = require('mongoose');
const { schema } = require('./secure/userRegValidation')
//model
const offerSchema = new mongoose.Schema({
    mediaId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    // قیمت به ازای هر 1000 بازدید
    // توسط خودم در بک محاسبه می شود
    byVisit: {
        type: Number,
        required: true
    },
    //  میانگین قیمت تبلیغ ساعتی
    byHour: {
        type: Number,
        required: true
    },
    // جزییات تبلیغ بازدیدی
    byVisitDetail: {
        type: String,
        required: true
    },
    // جزیییات تبلیغ ساعتی
    byHourDetail: {
        type: String,
        required: true
    },

    minOrder: {
        type: Number,
        default: -1
    },


});
// static validation
offerSchema.statics.newOfferValidation = function (body) {
    return schema.validate(body, { abortEarly: false })
}

const Offer = mongoose.model('Offer', offerSchema);
exports.Offer = Offer

