const { Channel } = require('../models/channel')

exports.get = async (req, res) => {
    const channel = await Channel.find()
    res.send(channel)
}

exports.getById = async (req, res) => {
    const id=req.params.id
    const channel = await Channel.findById(id)
    res.send(channel)
}

exports.create = async (req, res) => {
    const p = req.params
    console.log('recieved data' + p)
    const channel = new Channel(p);
    await channel.save();
    res.json(channel)
}