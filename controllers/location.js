const { Location } = require('../models/locations')

exports.create = async (req, res, next) => {

    const body = req.body

    const { name } = body
    try {
        // avoid duplication
        const found = await Location.findOne({ name })

        if (found) {
            const error = new Error('این شهر قبلا ثبت شده است')
            error.statusCode = 400;
            throw error
        }

        const loc = new Location(body);
        await loc.save();
        res.json({ message: 'شهر با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}
exports.get = async (req, res, next) => {

    try {
        try {
            const locations = await Location.find()
            res.send(locations)
        } catch (error) {
            next(error)
        }

    } catch (err) {
        next(err)
    }
}


