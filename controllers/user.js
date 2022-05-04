const { User } = require('../models/user')

exports.create = async (req, res) => {
     // 1. validate
    // 2. check if email exist
    // 3. create
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (user) {
           return res.json('این ایمیل وجود دارد')
        }
        await User.userValidation(req.body)
        const new_user = await User.create(req.body)
        return res.json(new_user)
    } catch (err) {
        res.json(err)
    }

}