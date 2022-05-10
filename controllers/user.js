const { User } = require('../models/user')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
exports.create = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // find user
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: ['این ایمیل وجود دارد'] })
        }
        // validate
        await User.userValidation(req.body)
        //hash
        const hash = await bcrypt.hash(password, 10)
        // create
        await User.create(
            {
                email, password: hash
            }
        )
        return res.status(200).json({message:"کاربر با موفقیت ساخته شد"})
    } catch (err) {
        next(err)
    }

}

exports.handleLogin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        // not found user
        if (!user) {
            const error = new Error('کاربر مورد نظر یافت نشد')
            error.statusCode = 404;
            throw error
        }
        // wrong pass
        const isEquel = bcrypt.compare(password, user.password)
        if (!isEquel) {
            const error = new Error('نام کاربری یا کلمه عبور اشتباه است')
            error.statusCode = 404;
            throw error
        }
        // produce token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ token, id: user._id })
    } catch (err) {
        next(err)
    }


};