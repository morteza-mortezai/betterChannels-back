const mongoose = require('mongoose');
const {schema} =require('./secure/mediaValidation')

const mediaSchema = new mongoose.Schema({
    userId: {
        required: true,
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User'
    },
    type: {
        required: true,
        type: Number,
    },
    name: {
        required: true,
        type: String,
    },
    addr: {
        required: true,
        type: String,
        unique: true
    },
    desc: {
        required: true,
        type: String,
    },

    cats: {
        required: true,
        type: Array
    },
    locations: {
        required: true,
        type: Array,
    }
});

// kittySchema.methods.speak = function speak() {
//     const greeting = this.name
//         ? "Meow name is " + this.name
//         : "I don't have a name";
//     console.log(greeting);
// };
mediaSchema.statics.newMediaValidation=function (body) {
    return schema.validate(body, { abortEarly: false })
}
const Media = mongoose.model('Media', mediaSchema);
exports.Media = Media

