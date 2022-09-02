const mongoose = require('mongoose');
const { schema } = require('./secure/contactValidation')
//model
const contactSchema = new mongoose.Schema({

    // mediaId: {
    //     type: String,
    //     required: true,
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Media'
    // },
    phone: {
        type: String,

    },
    email: {
        type: String,

    },

    telId: {
        type: String,

    },
    insId: {
        type: String,

    },
    eitaId: {
        type: String,

    },
    baleId: {
        type: String,

    },

});
// static validation
contactSchema.statics.userValidation = function (body) {
    return schema.validate(body, { abortEarly: false })
}

const Contact = mongoose.model('Contact', contactSchema);
exports.Contact = Contact

