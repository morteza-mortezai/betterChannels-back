const { Router } = require('express');
const offerControllers = require('../controllers/offer')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.post('/create', authenticated, offerControllers.create)
router.get('', authenticated, offerControllers.get)
router.delete('/deleteAll', authenticated, offerControllers.deleteAll)

module.exports = router