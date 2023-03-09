const { User } = require('../models/user')
const { Verification } = require('../models/verification')
const { ResetPassword } = require('../models/resetPassword')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const { sendEmail } = require('../utils/mailer')
// ok3 // 
// برای آینده می توان 
// اجازه لاگین ایمیل های تایید نشده را داد ولی از انطرف آلرت گذاشت
exports.register = async (req, res, next) => {
    try {
        const { email, password, fullName } = req.body
        // validate
        await User.userRegValidation(req.body)
        // find user
        let user = await User.findOne({ email })
        if (user && user.isVerified) {
            return res.status(400).json({ errors: ['این ایمیل  قبلا ثبت نام کرده'] })
        }
        //hash
        const hash = await bcrypt.hash(password, 10)

        // create if user doesnt exist 
        if (!user) {
            user = await User.create({ email, fullName, password: hash })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        await Verification.deleteMany({ userId: user._id })
        await Verification.create({ userId: user._id, token })

        const link = `${process.env.DOMAIN_URL}verify?token=${token}`

        sendEmail(email, fullName, "کد تایید حساب کاربری  ", `
            با سلام
            <br>
            کد تایید
            <br>
            ${link}
            `)

        return res.status(200).json({ message: "ثبت نام با موفقیت انجام شد" })
    } catch (err) {
        next(err)
    }
}
// ok3
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // const token1= req.body.token
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
        //     const error = new Error( 'recaptcha is not valid' )
        // error.statusCode=400
        //     throw error
        // }
        // find user
        let user = await User.findOne({ email })
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
            error.statusCode = 401;
            throw error
        }
        // check user is verified or not
        if (!user.isVerified) {
            const error = new Error('لطفا حساب کاربری خود را تایید کنید')
            error.statusCode = 400;
            throw error
        }
        // check user is verified or not
        if (!user.active) {
            const error = new Error('حساب کاربری  غیر فعال است لطفا با ادمین تماس بگیرید')
            error.statusCode = 400;
            throw error
        }
        // produce token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ token })

    } catch (err) {
        next(err)
    }

}

exports.userInfo = async (req, res, next) => {
    const _id = req.userId
    try {
        // find user
        let user = await User.findOne({ _id })
        // not found user
        if (!user) {
            const error = new Error('کاربر مورد نظر یافت نشد')
            error.statusCode = 404;
            throw error
        }
        // check user is verified or not
        if (!user.isVerified) {
            const error = new Error('لطفا حساب کاربری خود را تایید کنید')
            error.statusCode = 401;
            throw error
        }
        res.status(201).json({ user })
    } catch (err) {
        next(err)
    }

}
// ok 3 not tested
// فعلا فرض بر این اسن که برای اسن قسمت نیاز به فرانت نداریم
exports.verify = async (req, res, next) => {
    try {
        const { token } = req.query
        let v = await Verification.findOne({ token })
        if (!v) {
            const error = new Error('خطا در تایید ایمیل ، لطفا دوباره ثبا نام کنید')
            error.statusCode = 400;
            throw error
        }
        // find user
        let user = await User.findOne({ _id: v.userId })

        if (!user) {
            const error = new Error('چنین کاربری وجود ندارد .')
            error.statusCode = 404;
            throw error
        }

        if (user && user.isVerified) {
            const error = new Error('این کاربر قبلا تایید شده است .')
            error.statusCode = 400;
            throw error
        }

        user.isVerified = true
        await user.save()
        // delete verification
        v.remove()
        let msg = 'ایمیل شما با موفقیت تایید شد'
        // token
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ token: accessToken, msg })

    } catch (err) {
        next(err)
    }

}
// ok3 not tested
exports.forgetPass = async (req, res, next) => {
    try {
        const { email
            // , token 
        } = req.body
        // recaptcha token
        // if (!token) {
        //     const error = new Error('recaptcha is not valid')
        //     error.statusCode = 400
        //     throw error
        // }
        // const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}&remoteip=${req.connection.remoteAddress}`

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
        //     const error = new Error('recaptcha is not valid')
        //     throw error
        // }

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
        await ResetPassword.deleteMany({ userId: user._id })
        await ResetPassword.create({ userId: user._id, token })
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
// ok3 not tested
exports.resetPass = async (req, res, next) => {
    const { token, password, resetToken } = req.body
    try {

        // 1. verify recaptcha response

        // const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}&remoteip=${req.connection.remoteAddress}`
        // console.log('verifyUrl', verifyUrl)
        // const response = await fetch(verifyUrl, {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        //     },
        // });
        // const json = await response.json();
        // if (!json.success) {
        //     console.log('response2', json)
        //     const error = new Error('recaptcha is not valid')
        //     error.statusCode = 400
        //     throw error
        // }

        // 2. find user and change password
        const resetPass = await ResetPassword.findOne({ token: resetToken })
        if (!resetPass) {

            const error = new Error('لطفا یکبار دیگر کلمه عبور را ریست کنید .')
            error.statusCode = 400;
            throw error

        }
        const user = await User.findOne({ _id: resetPass.userId })
        if (!user) {
            const error = new Error('کاربر مورد نظر یافت نشد')
            error.statusCode = 404;
            throw error
        }

        user.password = password
        await user.save()

        return res.status(200).json({ message: "کلمه عبور با موفقیت تغییر پیدا کرد ." })

    } catch (err) {
        next(err)
    }

}

