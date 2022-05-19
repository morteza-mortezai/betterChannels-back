const Yup = require('yup')

exports.schema = Yup.object().shape({
    fullName: Yup.string().required().min(3).max(90),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(8).max(255)
})