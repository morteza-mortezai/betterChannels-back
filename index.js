const express=require('express')
const app=express()
require('./config/db')
app.use(require('./routes/index'))

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port,()=>{
    console.log('server is ruuuned')
})