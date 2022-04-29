const { Post } = require('../models/post')

exports.getAll = async (req, res) => {
    const post = await Post.find()
    res.send(post)
}

exports.create = async (req, res) => {
    const p = req.params
    console.log('recieved data' + p)
    const fluffy = new Post(p);
    await fluffy.save();
    res.json(fluffy)
}