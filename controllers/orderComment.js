// const { OrderComment } = require('../models/orderComment')

exports.getByOrderId = async (req, res, next) => {
    const {orderId}=req.params
    try {
        // const comments =await OrderComment.find({orderId}).select('-mediaId -orderId -updatedAt -_id -__v')
        // res.json({comments})
    } catch (err) {
        next(err)
    }
}

exports.create = async (req, res, next) => {
    
    const {orderId,text}=req.body
    try {
        
            const com = new OrderComment({orderId,text});
            await com.save();
      
        res.json({ message: 'کامنت با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

