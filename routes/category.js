const { Router } = require('express');
const categoryControllers = require('../controllers/category')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.get('/',  categoryControllers.get)
router.post('/', authenticated, categoryControllers.create)

module.exports = router