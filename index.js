const express = require('express')
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const { errorHandler } = require('./middlewares/errors')
const bodyParser = require('body-parser');
const session = require("express-session");
const { setHeaders } = require('./middlewares/header')
// connect db
require('./config/db')

const app = express()

//* BodyPaser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(setHeaders);

// routes
app.use('/api/media', require('./routes/media'))
app.use('/api/user', require('./routes/user'))
app.use('/api/offer', require('./routes/offer'))
app.use('/api/location', require('./routes/location'))
app.use('/api/mediaType', require('./routes/mediaType'))
app.use('/api/category', require('./routes/category'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/comment', require('./routes/comment'))
app.use('/api/order', require('./routes/order'))
app.use('/api/orderComment', require('./routes/orderComment'))
app.use('/api/rolePermission', require('./routes/rolePermission'))

router.use('/api/api-docs', swaggerUi.serve);
var options = {
    swaggerOptions: {
        url: 'http://petstore.swagger.io/v2/swagger.json'
    }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(null, options));

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