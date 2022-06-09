const Yup = require('yup')

exports.schema = Yup.object().shape({
    userId: Yup.string().required(),
    mediaId: Yup.string().required(),
    price: Yup.number().required(),
    type: Yup.string().oneOf(['per', 'temp', 'byView']).required(),
    pos: Yup.string().oneOf(['lastPost', 'oneToLast', 'normal']).required(),
  
})