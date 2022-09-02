const { Media } = require('../models/media')
const { Contact } = require('../models/contact')


exports.get = async (req, res, next) => {
    try {
        const channel = await Media.find().populate(['userId', {
            path: 'contact',
            select:
                'phone email',
        }, {
                path: 'mediaType',
                select:
                    'name',
            }, {
                path: 'cats',
                select:
                    'title',
            }
        ])
        res.send(channel)
    } catch (err) { next(err) }
}

exports.getById = async (req, res) => {
    const _id = req.params.id
    const channel = await Media.findById({ _id })
    res.send(channel)
}

exports.update = async (req, res,next) => {
    try {
        const _id = req.params.id
        const channel = await Media.findById({ _id })

        if (!channel) {
            const error = new Error('رسانه مورد نظر یافت نشد')
            error.statusCode = 404;
            throw error
        }
        channel.title = 'title editted 333'
        const updated = await channel.save()
        console.log('updated', updated)
        res.send({ message: 'رسانه مورد نظر با موفقیت برزو رسانی شد' })
    } catch (err) { next(err)}
}

exports.create = async (req, res, next) => {

    const userId = req.userId
    const { id, mediaType, contact, cats, title, addr } = req.body
    try {
        // validate
        await Media.newMediaValidation(req.body)
        // avoid duplication
        const found = await Media.findOne({ id })
        if (found && found.id == id) {
            const error = new Error('این رسانه قبلا ثبت شده است')
            error.statusCode = 400;
            throw error
        }
        // 1. register contact
        // JSON.parse(contact)

        // const conContact=JSON.parse(contact)
        const conContact = contact
        // console.log('contact1',typeof contact)
        // console.log('contact2', contact)
        const con = new Contact({ ...conContact })
        const savedConatact = await con.save()
        // console.log('savedConatact', savedConatact)
        // console.log('res', res)
        // body.contact = savedConatact._id

        // const concats = JSON.parse(cats)
        // console.log('cats',cats[0],cats[1])
        const channel = new Media({ userId, id, mediaType, contact: savedConatact._id, cats, title, addr });
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

exports.deleteAll = async (req, res, next) => {

    try {

        await Media.deleteMany()
        res.send({ success: 'true' })

    } catch (err) { next(err) }
}

// create method should test if it's registered before or not to avoid duplication