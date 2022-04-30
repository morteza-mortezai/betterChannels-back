const express=require('express')
const app=express()
// connect db
require('./config/db')
// routes
app.use('/channel',require('./routes/index'))
app.use(express.json())
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
app.listen(port,()=>{
    console.log('server is ruuuned')
})