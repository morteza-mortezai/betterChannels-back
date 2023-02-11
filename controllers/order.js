const { Order } = require('../models/order')
// const { OrderComment } = require('../models/orderComment')

exports.create = async (req, res, next) => {

    const { userId } = req
    const { mediaId, text } = req.body
    try {
        const doc = new Order({ mediaId, buyerId: userId });
        const { _id } = await doc.save();

        // if(text){
        //     const com = new OrderComment({orderId:_id,text});
        //     await com.save();
        // }
        res.json({ message: 'سفارش با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

exports.getByMediaId = async (req, res, next) => {
    const { mediaId } = req.params
    try {
        const data = await Order.find({ mediaId }).select('-mediaId -buyerId')
        res.json({ data })
    } catch (err) {
        next(err)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const data = await Order.find().select('-mediaId -buyerId')
        res.json({ data })
    } catch (err) {
        next(err)
    }
}

exports.delete = async (req, res, next) => {
    const { orderId } = req.params
    try {
        await Order.findByIdAndDelete(orderId)
        res.send({ message: 'با موفقیت پاک شد' })
    } catch (err) { next(err) }
}
// بعد اینکه سفارش تموم شد در کنترلر کامنت تکلیف isBuyer  مشخص می شود