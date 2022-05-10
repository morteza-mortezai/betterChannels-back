const { Router } = require('express');
const postControllers = require('../controllers/channel')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.get('/', postControllers.get)
router.post('/create', authenticated, postControllers.create)
router.get('/:id', postControllers.getById)
module.exports = router