const { MediaType } = require('../models/mediaType')

exports.create = async (req, res, next) => {

    const body = req.body
   
    // body.userId = req.userId
    try {
        // validate
        // await MediaType.newOfferValidation(body)
        // avoid duplication

        const md = new MediaType(body);
        await md.save();
        res.json({ message: 'مدیا تایپ با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

exports.get = async (req, res, next) => {
     try {
          const list = await MediaType.find()
        res.send(list)
        // res.json({ message: 'مدیا تایپ با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}


