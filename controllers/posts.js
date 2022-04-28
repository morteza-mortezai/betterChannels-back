const { Kitten } = require('../models/post')

exports.getAll =async (req, res) => {
    const post =await Kitten.find()
    res.send(post)
}

exports.create =async (req, res) => {
    const fluffy = new Kitten({ name: 'fluffy' });
    await fluffy.save();
    res.json(fluffy)
}