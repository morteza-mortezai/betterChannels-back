require('dotenv').config()
// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err+'dsfdfs'));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('db is connected')
    
}