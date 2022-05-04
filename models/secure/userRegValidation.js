const Yup = require('yup')

exports.schema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(8).max(255)
})