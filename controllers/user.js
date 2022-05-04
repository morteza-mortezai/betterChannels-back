const { User } = require('../models/user')

exports.create = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: ['این ایمیل وجود دارد'] })
        }
        await User.userValidation(req.body)
        await User.create(req.body)
        return res.end()
    } catch (err) {
        const errors = []
        errors = err.errors
        res.status(400).json({ errors })
    }

}