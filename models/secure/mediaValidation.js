const Yup = require('yup')

exports.schema = Yup.object().shape({
    type:Yup.number().required(),
    name: Yup.string().required().min(3).max(90),
    addr: Yup.string().required().min(3).max(90),
    desc: Yup.string().min(3).max(90),
    cats:Yup.array(),
    loactions:Yup.array(),
    p1:Yup.number().required(),
    p2:Yup.number().required(),
    a1:Yup.number().required(),
    a2:Yup.number().required(),
    a3:Yup.number().required(),
    minOrder:Yup.number().required(),
})