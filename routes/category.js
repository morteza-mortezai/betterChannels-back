const { Router } = require('express');
const categoryControllers = require('../controllers/category')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.get('/', authenticated, categoryControllers.get)
router.post('/create', authenticated, categoryControllers.create)

module.exports = router