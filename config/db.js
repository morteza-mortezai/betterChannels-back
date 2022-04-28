// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err+'dsfdfs'));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('db is connected')
    
}