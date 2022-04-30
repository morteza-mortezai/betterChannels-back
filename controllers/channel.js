const { Channel } = require('../models/post')

exports.get = async (req, res) => {
    const channel = await Channel.find()
    res.send(channel)
}

exports.create = async (req, res) => {
    const p = req.params
    console.log('recieved data' + p)
    const channel = new Channel(p);
    await channel.save();
    res.json(channel)
}