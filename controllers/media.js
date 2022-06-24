const { Media } = require('../models/media')

exports.get = async (req, res, next) => {
    try {
        const channel = await Media.find().populate('userId')
        res.send(channel)
    } catch (err) { next(err) }
}

exports.getById = async (req, res) => {
    const id = req.params.id
    const channel = await Media.findById(id)
    res.send(channel)
}

exports.create = async (req, res, next) => {

    const body = req.body
    const { addr } = body
    body.userId = req.userId
    try {
        // validate
        await Media.newMediaValidation(req.body)
        // avoid duplication
        const found = await Media.findOne({ addr })
        if (found) {
            const error = new Error('این رسانه قبلا ثبت شده است')
            error.statusCode = 400;
            throw error
        }

        const channel = new Media(body);
        await channel.save();
        res.json({ message: 'کانال با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

exports.getByUser = async (req, res, next) => {
    const userId = req.userId
    try {
        const channels = await Media.find({ userId })
        res.send(channels)

    } catch (err) { next(err) }
}

