const mongoose = require('mongoose');
const { schema } = require('./secure/mediaValidation')

const mediaSchema = new mongoose.Schema({
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    offer: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    mediaType: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MediaType'
    },
    title: {
        required: true,
        type: String,
    },
    addr: {
        required: true,
        type: String,
        unique: true
    },
    id: {
        required: true,
        type: String,
        unique: true
    },
    desc: {
        required: false,
        type: String,
    },

    cats: [{
        required: true,
        // type:String
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    locations: [{
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'

    }],

    contact: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'

    },

    visits: {
        required: false,
        type: Number,
        default: 0
    },
    follower: {
        required: false,
        type: Number,
        default: 0
    },

    lang: {
        required: true,
        type: String,
        enum: ['en', 'fa'],
        default: 'fa'
    },
    score: {
        required: false,
        type: Number,
        default: 0
    },
    engRate: {
        required: false,
        type: Number,
        default: 0
    },
});

// kittySchema.methods.speak = function speak() {
//     const greeting = this.name
//         ? "Meow name is " + this.name
//         : "I don't have a name";
//     console.log(greeting);
// };
mediaSchema.statics.newMediaValidation = function (body) {
    return schema.validate(body, { abortEarly: false })
}
const Media = mongoose.model('Media', mediaSchema);
exports.Media = Media

