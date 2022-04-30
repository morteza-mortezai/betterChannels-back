const mongoose = require('mongoose');
const channelSchema = new mongoose.Schema({
    title: String,
    addr:String,
    desc: String,
    created: Date
});

// kittySchema.methods.speak = function speak() {
//     const greeting = this.name
//         ? "Meow name is " + this.name
//         : "I don't have a name";
//     console.log(greeting);
// };

const Channel = mongoose.model('Channel', channelSchema);
exports.Channel = Channel

