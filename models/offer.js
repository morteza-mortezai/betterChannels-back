const mongoose = require('mongoose');
const { schema } = require('./secure/newOfferValidation')
//model
const offerSchema = new mongoose.Schema({
    mediaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Media'
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
    // مثلا شامل اینکه {count:100 , cost:10000}
    byVisitDetail: [
        { count: { type: Number }, cost: { type: Number } }
    ],
    // جزیییات تبلیغ ساعتی
    byHourDetail: [
        { hour: { type: Number }, cost: { type: Number } },
    ],

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

