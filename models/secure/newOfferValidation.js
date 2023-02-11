const Yup = require('yup')

exports.schema = Yup.object().shape({
    mediaId: Yup.string().required(),
    byVisitDetail: Yup.array().required(),
    byHourDetail: Yup.array().required(),
})