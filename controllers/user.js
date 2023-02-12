const { User } = require('../models/user')
const { Verification } = require('../models/verification')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const { sendEmail } = require('../utils/mailer')
// ok3
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
        // کد 6 رقمی بسازیم
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
// ok 2
// اینو باید تست کنم
// ضمن اینکه به فرانت هم شاید احتیاح نباشه
// *************
exports.verify = async (req, res, next) => {
    const { token } = req.body
    try {
        let v = await Verification.findOne({ token: token })
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

        // توکن هم ارسال شود
        user.isVerified = true
        await user.save()

        let msg = 'ایمیل شما با موفقیت تایید شد'
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ token, msg })

    } catch (err) {
        next(err)
    }

}
// ok 2
// شاید میشد اینجا ایمیل رو از سشن یبگیرم 
// مرحله ثبت نام میشد ایمیل رو در سشن ذخیره کرده
exports.newCode = async (req, res, next) => {
    // میشد چک کرد آیا چنین کاربری در دیتابیس هست یا نه
    const { email } = req.body
    try {
        // find user
        let user = await User.findOne({ email })

        if (!user) {
            const error = new Error('چنین کاربری وجود ندارد .')
            error.statusCode = 404;
            throw error
        }

        await Verification.deleteMany({ email })
        const randomNumber = (Math.random() * 1000000).toString().substring(0, 6)
        await Verification.create({ email, randomNumber })

        sendEmail(email, '', "کد تایید حساب کاربری  ", `
            با سلام
            <br>
            کد تایید
            <br>
            ${randomNumber}
            `)

        res.json({ message: 'کد تایید با موفقیت ارسال شد' })
    } catch (err) {
        next(err)
    }
}
// ریفکتور لازم
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
        const token1 = jwt.sign({ userId: user._id, timeStamp }, process.env.JWT_SECRET)

        const link = `${process.env.DOMAIN_URL}resetPass?token=${token1}`

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
// کد هم باید بگیره و
// اگه یکسان نبود ارور بده
// لازم نیست توکن بگیره
exports.resetPass = async (req, res, next) => {
    const { token, password, resetToken } = req.body
    console.log('token for google', token)
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
        const nowTimeStamp = Date.now()
        const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET)
        const { userId, timeStamp } = decodedToken
        console.log(' userId, timeStamp', userId, timeStamp)
        if (nowTimeStamp - timeStamp > 15 * 60 * 6000) {
            const error = new Error('لینک ارسال شده متقضی شده لطفا دوباره امتحان کنید .')
            error.statusCode = 400
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

// برای تایید شماره همراه یا ایمیل هم تابع لازمه