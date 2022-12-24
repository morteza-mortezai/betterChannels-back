const { Router } = require('express');
const userControllers = require('../controllers/user')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.post('/create', userControllers.create)
router.post('/login', userControllers.handleLogin)
router.post('/verify', userControllers.verify)
router.post('/resend', userControllers.resend)
router.post('/forgetPass', userControllers.forgetPass)
router.post('/resetPass', userControllers.resetPass)
router.get('/', authenticated, userControllers.resetPass)

module.exports = router