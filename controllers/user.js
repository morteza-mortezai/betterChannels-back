const { User } = require('../models/user')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../utils/mailer')

exports.create = async (req, res, next) => {
    try {
        const { email, password, fullName } = req.body
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
        const createdUser = await User.create(
            {
                email, fullName, password: hash
            }
        )

        const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET)
        const link = `http://localhost:5000/user/verify?token=${token}`

        sendEmail(email, fullName, "تایید حساب کاربری  ", `
        با سلام
        <br>
        برای تایید آدرس ایمیل روی لینک زیر کلیک کنید
        <br>
        ${link}
        `)

        return res.status(200).json({ message: "ایمیل تایید با موفقیت ارسال شد", user: { token, fullName: createdUser.fullName } })
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
        res.status(201).json({ token, fullName: user.fullName })

    } catch (err) {
        next(err)
    }

}

exports.verify = async (req, res, next) => {

    const { token } = req.query
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const { userId } = decodedToken
    console.log('userID ', userId)
    try {
        const user = await User.findOne({ _id: userId })
        user.active = true
        await user.save()
        res.json({ message: 'ایمیل شما با موفقیت تایید شد' })
    } catch (err) {
        next(err)
    }

}