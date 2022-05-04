const { User } = require('../models/user')

exports.create = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.json({ err: 'این ایمیل وجود دارد' })
        }
        await User.userValidation(req.body)
        await User.create(req.body)
        return res.json({})
    } catch (err) {
        res.status(400).send({ err })
    }

}