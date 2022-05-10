const express = require('express')
const {errorHandler}=require('./middlewares/errors')
const bodyParser = require('body-parser');
const session = require("express-session");
const {setHeaders}=require('./middlewares/header')
// connect db
require('./config/db')

const app = express()

//* BodyPaser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(setHeaders);

// routes
app.use('/channel', require('./routes/index'))
app.use('/user', require('./routes/user'))

// handle errors
app.use(errorHandler)

//* Session
app.use(
    session({
        secret: "secret",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    })
);


const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
app.listen(port, () => {
    console.log('server is ruuuned')
})