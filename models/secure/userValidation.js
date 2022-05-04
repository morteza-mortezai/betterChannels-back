const Yup=require('yup')

exports.schema=Yup.object().shape({
    fullName:Yup.string().required().min(4).max(255),
    email:Yup.string().required().email(),
    active:Yup.boolean(),
    phone:Yup.number().integer().min(10).max(10),
    password:Yup.string().required().min(8).max(255)
})