const { Router } = require('express');
const contactControllers = require('../controllers/contact')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.post('/create', authenticated, contactControllers.create)
router.get('/', authenticated, contactControllers.get)

module.exports = router


// آیا یک کاربر می تواند همه کانتکتها را بگیرد این موضوع باید بررسی شود