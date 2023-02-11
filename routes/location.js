const { Router } = require('express');
const locControllers = require('../controllers/location')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.post('/', authenticated, locControllers.create)
router.get('/', locControllers.get)


module.exports = router