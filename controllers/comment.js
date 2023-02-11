const { Comment } = require('../models/comment')

exports.create = async (req, res, next) => {

    const {userId}=req
    const {mediaId,text}=req.body
    try {
        const isBuyer=false
        const doc = new Comment({userId,mediaId,text,isBuyer});
        await doc.save();
        res.json({ message: 'نظر با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}


