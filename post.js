// route / post.js
// this is example of using auth.js middleware for authentication
const { Router } = require('express');
const postControllers = require('../controllers/post')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.get('/',  postControllers.get) 
router.post('/create', authenticated, postControllers.create) // only logined users can create post 

module.exports = router