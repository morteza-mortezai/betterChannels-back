const { Offer } = require('../models/offer')

exports.create = async (req, res, next) => {

    const body = req.body
   
    body.userId = req.userId
    try {
        // validate
        await Offer.newOfferValidation(body)
        // avoid duplication

        const Offer = new Offer(body);
        await Offer.save();
        res.json({ message: 'آفر با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}


