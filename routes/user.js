const { Router } = require('express');
const userControllers = require('../controllers/user')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.post('/register', userControllers.register)
router.post('/login', userControllers.login)
router.post('/verify', userControllers.verify)
// router.post('/newCode', userControllers.newCode)
router.post('/forgetPass', userControllers.forgetPass)
router.post('/resetPass', userControllers.resetPass)
router.get('/info', authenticated, userControllers.userInfo)

module.exports = router