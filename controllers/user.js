const { User } = require('../models/user')
const { Verification } = require('../models/verification')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const { sendEmail } = require('../utils/mailer')
// ok
exports.register = async (req, res, next) => {
    try {
        const { emailPhone, password, fullName } = req.body
        // validate
        await User.userRegValidation(req.body)
        // find user
        let user = await User.findOne({
            $or: [{
                "email": emailPhone
            }, {
                "phone": emailPhone
            }]
        })
        if (user && user.isVerified) {
            return res.status(400).json({ errors: ['این ایمیل  قبلا ثبت نام کرده'] })
        }
        // validate
        await User.userRegValidation(req.body)
        //hash
        const hash = await bcrypt.hash(password, 10)
        let isEmail = false
        // تشخیص بدیم
        if (emailPhone.indexOf('@')) {
            isEmail = true
        }
        // create if user doesnt exist 
        // این مرحله و بعدی باید با هم انجام بشه
        if (!user) {
            if (isEmail) {
                user = await User.create(
                    {
                        email: emailPhone, fullName, password: hash
                    }
                )
            } else {
                user = await User.create(
                    {
                        phone: emailPhone, fullName, password: hash
                    }
                )
            }
        }
        // کد 6 رقمی بسازیم
        const randomNumber = (Math.random() * 1000000).toString().substring(0, 6)
        // در دیتا بیس بزاریم
        // اگه .جود داره قبلی باید پاک بشه
        // find verif
        await Verification.deleteMany({ emailPhone })
        await Verification.create({ emailPhone, randomNumber })
        // اینچا چک کنیم اگه عملیات قبلی اوکی نبود عملیات فعلی هم لفو بشه
        // اگخ دومی ارور داد اولی پاک بشه
        // ارسال کنیم
        //بر حسب ایمیل یا فون
        if (isEmail) {
            sendEmail(emailPhone, fullName, "کد تایید حساب کاربری  ", `
            با سلام
            <br>
            کد تایید
            <br>
            ${randomNumber}
            `)
        } else {
            // send sms
        }

        // توکن مرحله بعد ساخته میشه
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        // const link = `${process.env.DOMAIN_URL}verify?token=${token}`
        return res.status(200).json({ message: "کد تایید با موفقیت ارسال شد" })
    } catch (err) {
        next(err)
    }
}
// ok
exports.login = async (req, res, next) => {
    try {
        const { emailPhone, password } = req.body
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
        let user = await User.findOne({
            $or: [{
                "email": emailPhone
            }, {
                "phone": emailPhone
            }]
        })
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
        // produce token
        res.status(201).json({ user })
    } catch (err) {
        next(err)
    }

}
// ok 
// شاید میشد ایمیبل رو از سشن گرفت 
exports.verify = async (req, res, next) => {
    const { emailPhone, code } = req.body
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    // const { userId } = decodedToken
    // بگردیم پیدا کنیم
    // اگه نبود ارور بدیم
    // اگه بود مقایسه کنیم با کد ارسالی 
    // اگه برابر نبود خطا بدیم
    // اگه برابر بود 
    // کاربر رو آپدیت کنیم
    try {
        // find user
        let user = await User.findOne({
            $or: [{
                "email": emailPhone
            }, {
                "phone": emailPhone
            }]
        })

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

        const verification = await Verification.findOne({ emailPhone })
        if (!verification) {
            const error = new Error('کد ارسالی منقضی شده لطفا درخواست کد جدید کنید .')
            error.statusCode = 400;
            throw error
        }

        if (verification.randomNumber !== code) {
            const error = new Error('کد وارد شده اشتباه است لطفا مجددا امتحان کنید .')
            error.statusCode = 400;
            throw error
        }
        // توکن هم ارسال شود
        user.isVerified = true
        await user.save()

        let isEmail = false
        if (emailPhone.indexOf('@')) {
            isEmail = true
        }
        let msg = 'شماره همراه شما با موفقیت تایید شد'
        if (isEmail) {
            msg = 'ایمیل شما با موفقیت تایید شد'
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ token, msg })

    } catch (err) {
        console.log('err', JSON.stringify(err))
        next(err)
    }

}
// ok
// شاید میشد اینجا ایمیل رو از سشن یبگیرم 
// مرحله ثبت نام میشد ایمیل رو در سشن ذخیره کرده
exports.newCode = async (req, res, next) => {
    // میشد چک کرد آیا چنین کاربری در دیتابیس هست یا نه
    const { emailPhone } = req.body
    try {
        // find user
        let user = await User.findOne({
            $or: [{
                "email": emailPhone
            }, {
                "phone": emailPhone
            }]
        })

        if (!user) {
            const error = new Error('چنین کاربری وجود ندارد .')
            error.statusCode = 404;
            throw error
        }

        await Verification.deleteMany({ emailPhone })
        const randomNumber = (Math.random() * 1000000).toString().substring(0, 6)
        await Verification.create({ emailPhone, randomNumber })
        if (emailPhone.indexOf('@')) {
            isEmail = true
        }
        if (isEmail) {
            sendEmail(emailPhone, '', "کد تایید حساب کاربری  ", `
            با سلام
            <br>
            کد تایید
            <br>
            ${randomNumber}
            `)
        } else {
            // send sms
        }
        res.json({ message: 'کد تایید با موفقیت ارسال شد' })
    } catch (err) {
        next(err)
    }
}
// ریفکتور لازم
exports.forgetPass = async (req, res, next) => {


    try {
        const { email, token } = req.body
        // recaptcha token
        if (!token) {
            const error = new Error('recaptcha is not valid')
            error.statusCode = 400
            throw error
        }
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}&remoteip=${req.connection.remoteAddress}`

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
            const error = new Error('recaptcha is not valid')
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
            const error = new Error('recaptcha is not valid')
            error.statusCode = 400
            throw error
        }

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