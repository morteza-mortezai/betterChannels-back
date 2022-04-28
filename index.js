const express=require('express')
const app=express()
require('./config/db')
app.use(require('./routes/index'))


app.listen(3000,()=>{
    console.log('server is ruuuned')
})