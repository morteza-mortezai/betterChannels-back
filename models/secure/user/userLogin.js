const Yup = require('yup')

exports.loginSchema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(8).max(255),
    token: Yup.string().required().min(10),
})