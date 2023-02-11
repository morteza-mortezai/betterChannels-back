const Yup = require('yup')

exports.schema = Yup.object().shape({
    title: Yup.string().required(),

})