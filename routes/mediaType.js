const { Router } = require('express');
const mediaTypeControllers = require('../controllers/mediaType')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.post('/create', authenticated, mediaTypeControllers.create)
router.get('/',  mediaTypeControllers.get)

module.exports = router