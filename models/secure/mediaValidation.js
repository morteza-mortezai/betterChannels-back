const Yup = require('yup')

exports.schema = Yup.object().shape({
    type:Yup.number().required(),
    name: Yup.string().required().min(3).max(90),
    addr: Yup.string().required().min(3).max(90),
    desc: Yup.string().min(3).max(90),
    cats:Yup.array()
})