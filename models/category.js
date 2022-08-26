const mongoose = require('mongoose');
const { schema } = require('./secure/categoryValidation')
//model
const catSchema = new mongoose.Schema({

    title: { type: String, required: true },
});
// static validation
catSchema.statics.newCategoryValidation = function (body) {
    return schema.validate(body, { abortEarly: false })
}

const Category = mongoose.model('Category', catSchema);
exports.Category = Category

