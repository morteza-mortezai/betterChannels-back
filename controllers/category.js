const { Category } = require('../models/category')

exports.create = async (req, res, next) => {

    const body = req.body

    try {
        // validate
        await Category.newCategoryValidation(body)
        // avoid duplication
        const { title } = body
        const cat = await Category.findOne({ title })
        if (cat) {
            const error = new Error({ message: 'این دسته بندی از قبل موجود است' })
            throw error
        }

        const category = new Category(body);
        await category.save();
        res.json({ message: 'دسته بندی جدید با موفقیت ایجاد شد' })
    } catch (err) {
        next(err)
    }
}

exports.get = async (req, res, next) => {

    try {
        // validate
        const categories = await Category.find()
        res.json(categories)
        
    } catch (err) {
        next(err)
    }
}


