const Yup = require('yup')

exports.schema = Yup.object().shape({
    mediaId: Yup.string().required(),
    phone: Yup.string().min(11).max(11),
    email: Yup.string().email(),
    // telId: Yup.string(),
    // insId: Yup.string(),
    // eitaId: Yup.string(),
    
})