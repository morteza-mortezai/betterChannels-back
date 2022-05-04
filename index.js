const express = require('express')
const app = express()
const bodyParser = require('body-parser');
// connect db
require('./config/db')

//* BodyPaser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/channel', require('./routes/index'))
app.use('/user', require('./routes/user'))

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
app.listen(port, () => {
    console.log('server is ruuuned')
})