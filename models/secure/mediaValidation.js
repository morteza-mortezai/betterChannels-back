const Yup = require('yup')

exports.schema = Yup.object().shape({
    // userId:Yup.string().required(),
    mediaType:Yup.string().required(),
    title: Yup.string().required().min(3).max(90),
    addr: Yup.string().required().min(3).max(90),
    desc: Yup.string().min(3).max(90),
    id: Yup.string().min(3).max(90),
    cats:Yup.array(),
    loactions:Yup.array(),

})