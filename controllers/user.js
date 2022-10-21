const { User } = require('../models/user')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
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
        await User.userRegValidation(req.body)
        //hash
        const hash = await bcrypt.hash(password, 10)
 
        // create
        const createdUser = await User.create(
            {
                email, fullName, password: hash
            }
        )

        const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET)
        const link = `${process.env.DOMAIN_URL}verify?token=${token}`

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
    const { email, password} = req.body
    // const token1= req.body.token
    try {
        // recaptcha token
        // if (!token1) {
        //     const error = new Error({ message: 'recaptcha is not valid' })
        //     throw error
        // }
        // await User.userLoginValidation(req.body)
        
        // const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token1}&remoteip=${req.connection.remoteAddress}`
        // // verify recaptcha response
        // const response = await fetch(verifyUrl, {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        //     },
        // });

        // const json = await response.json();

        // if (!json.success) {
        //     const error = new Error({ message: 'recaptcha is not valid' })
        //     throw error
        // }

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

    const { token } = req.body

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const { userId } = decodedToken


    try {
        const user = await User.findOne({ _id: userId })
        user.active = true
        await user.save()
        res.json({ message: 'ایمیل شما با موفقیت تایید شد' })
    } catch (err) {
        next(err)
    }

}

exports.forgetPass = async (req, res, next) => {
    const { email, token } = req.body

    // recaptcha token
    if (!token) {
        const error = new Error({ message: 'recaptcha is not valid' })
        throw error
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}&remoteip=${req.connection.remoteAddress}`

    try {
        // verify recaptcha response
        const response = await fetch(verifyUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            },
        });

        const json = await response.json();

        if (!json.success) {
            const error = new Error({ message: 'recaptcha is not valid' })
            throw error
        }

        const user = await User.findOne({ email })
        // not found user
        if (!user) {
            const error = new Error('کاربر مورد نظر یافت نشد')
            error.statusCode = 404;
            throw error
        }

        const timeStamp = Date.now()

        // produce token with timestamp
        const token = jwt.sign({ userId: user._id, timeStamp }, process.env.JWT_SECRET)

        const link = `${process.env.DOMAIN_URL}resetPass?token=${token}`

        sendEmail(user.email, user.fullName, "بازیابی رمز عبور", `
        با سلام
        <br>
        برای بازیابی رمز عبور روی لینک زیر کلیک کنید
        <br>
        ${link}
        `)

        return res.status(200).json({ message: "ایمیل بازیابی کلمه عبور با موفقیت ارسال شد" })

    } catch (err) {
        next(err)
    }

}

exports.resetPass = async (req, res, next) => {
    const { token, password, resetToken } = req.body
console.log('token for google',token)
    try {

        // 1. verify recaptcha response

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}&remoteip=${req.connection.remoteAddress}`
        console.log('verifyUrl', verifyUrl)
        const response = await fetch(verifyUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            },
        });
        const json = await response.json();
        if (!json.success) {
            console.log('response2', json)
            const error = new Error({ message: 'recaptcha is not valid' })
            throw error
        }

        // 2. find user and change password
        const nowTimeStamp = Date.now()
        const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET)
        const { userId, timeStamp } = decodedToken
        console.log(' userId, timeStamp', userId, timeStamp)
        if (nowTimeStamp - timeStamp > 15 * 60 * 6000) {
            const error = new Error({ message: 'لینک ارسال شده متقضی شده لطفا دوباره امتحان کنید .' })
            throw error
        }
        const user = await User.findOne({ _id: userId })
        console.log('user', user)
        user.password = password
        await user.save()

        // 3. make new token for login user
        const token2 = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

        return res.status(200).json({ message: "کلمه عبور با موفقیت تغییر پیدا کرد .", user: { token: token2, fullName: user.fullName } })

    } catch (err) {
        next(err)
    }

}