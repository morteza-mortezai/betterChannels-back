const mongoose = require('mongoose');
const { schema } = require('./secure/mediaValidation')

const mediaSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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
        link: {
            required: true,
            type: String,
            unique: true
        },
        addr: {
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
    },
    { timestamps: true }
);

mediaSchema.statics.newMediaValidation = function (body) {
    return schema.validate(body, { abortEarly: false })
}
const Media = mongoose.model('Media', mediaSchema);
exports.Media = Media

