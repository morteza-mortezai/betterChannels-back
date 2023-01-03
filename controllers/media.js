const { Media } = require('../models/media')
const { Contact } = require('../models/contact')
const { Comment } = require('../models/comment')


exports.get = async (req, res, next) => {
    const queries = req.query
    let { vip, cats, title, locations, page, limit,sortBy } = queries
    if (!limit) limit = 6
    if (!page) page = 1
   
    // add queries
    const appliedQueries = {}
    if (vip) appliedQueries['vip'] = vip;
    if (title) appliedQueries['title'] = { $regex: regex };
    if (cats) appliedQueries['cats'] = { $in: cats };
    if (locations) appliedQueries['locations'] = { $in: locations };

      const regex = new RegExp(title, 'i')
    // پارامترای اضافی پاک شوند مثلا پیج و تعداد
    try {
         Media.find(appliedQueries, null).populate([{
            path: 'userId',
            select: '_id'
        }, {
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
        }, {
            path: 'locations',
            select:
                'name',
        }
        ]).sort(sortBy)
        //paging
        .skip(Math.max(0, (page - 1) * limit)).limit(limit)
        // calculate count
        .exec(function (err, medium) {
            Media.count().exec(function (error, count) {

                res.send({ data: medium, page, pages: Math.ceil(count / limit) })
            })
        })
    } catch (err) { next(err) }
}

exports.getById = async (req, res) => {
    const _id = req.params.id
    const channel = await Media.findById({ _id })
    const comments = await Comment.find({ mediaId: _id }).select('-mediaId').populate([
        {
            path: 'userId',
            select: 'fullName',
        }
    ])
    res.send({ channel, comments })
}

exports.update = async (req, res, next) => {
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
    } catch (err) { next(err) }
}
// contact changed
// now must be like [{cType:1,value:'@myId'}]
exports.create = async (req, res, next) => {

    const userId = req.userId
    const { link, mediaType, contact, cats, title, addr, locations,follower,desc } = req.body
    try {
        // validate
        await Media.newMediaValidation(req.body)
        // avoid duplication
        const found = await Media.findOne({ addr })
        if (found && found.addr == addr) {
            const error = new Error('این رسانه قبلا ثبت شده است')
            error.statusCode = 400;
            throw error
        } 
        // 1. register contact
        // JSON.parse(contact)

        // const conContact=JSON.parse(contact)
        // const conContact = contact
        // console.log('contact1',typeof contact)
        // console.log('contact2', contact)
        // const con = new Contact({ ...conContact })
        // const savedConatact = await con.save()
        // console.log('savedConatact', savedConatact)
        // console.log('res', res)
        // body.contact = savedConatact._id

        // const concats = JSON.parse(cats)
        // console.log('cats',cats[0],cats[1])
        const channel = new Media({ userId, addr, mediaType, contact, cats, title, link, locations,follower,desc  });
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

