const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: String,
    desc: String,
    created: Date
});

// kittySchema.methods.speak = function speak() {
//     const greeting = this.name
//         ? "Meow name is " + this.name
//         : "I don't have a name";
//     console.log(greeting);
// };

const Post = mongoose.model('Post', postSchema);
exports.Post = Post

