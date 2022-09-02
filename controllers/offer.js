const { Offer } = require('../models/offer')
const { Media } = require('../models/media')
const mongoose = require('mongoose')

exports.create = async (req, res, next) => {

    const body = req.body
    const { mediaId, byVisitDetail, byHourDetail } = req.body
    // body.userId = req.userId
    try {
        // validate
        await Offer.newOfferValidation(body)
        // avoid duplication
        const found = await Offer.findOne({ mediaId })
        if (found) {
            const error = new Error('برای این رسانه قبلا آفر ثبت شده است .')
            error.statusCode = 400;
            throw error
        }
        // find Media 
        console.log('media id', mediaId)
        const foundMedia =await Media.findById({ _id: mediaId })
        if (!foundMedia) {
            const error = new Error('رسانه انتخاب شده وجود ندارد')
            error.statusCode = 400;
            throw error
        }
        console.log('media title', foundMedia.title)
        // calculate Ave for byHour
        const sumHour = byHourDetail.reduce((total, item) => {
            return parseInt(total) + parseInt(item.hour)
        }, 0)
        const sumCost = byHourDetail.reduce((total, item) => {
            return parseInt(total) + parseInt(item.cost)
        }, 0)
        const byHour = (sumCost / sumHour).toFixed(2)

        // calculate Ave for byVisit
        const sumCount = byVisitDetail.reduce((total, item) => {
            return parseInt(total) + parseInt(item.count)
        }, 0)
        const sumVisitCost = byVisitDetail.reduce((total, item) => {
            return parseInt(total) + parseInt(item.cost)
        }, 0)
        const byVisit = (sumVisitCost / sumCount).toFixed(2)

        body.byHour = byHour
        body.byVisit = byVisit
        //save offer
        const item = new Offer(body);
        const savedOffer = await item.save();
        // set offer for media
        // console.log('media', media)
        foundMedia.offer = savedOffer._id
        await foundMedia.save()

        res.json({ message: 'آفر با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

exports.get = async (req, res, next) => {
    try {
        const items = await Offer.find()
        res.send(items)
    } catch (err) { next(err) }
}

exports.deleteAll = async (req, res, next) => {

    try {

        await Offer.deleteMany()
        res.send({ success: 'true' })

    } catch (err) { next(err) }
}