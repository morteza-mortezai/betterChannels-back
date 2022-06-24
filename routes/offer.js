const { Router } = require('express');
const offerControllers = require('../controllers/offer')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.post('/create', authenticated, offerControllers.create)

module.exports = router