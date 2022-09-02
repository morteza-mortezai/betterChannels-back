const { Router } = require('express');
const mediaControllers = require('../controllers/media')
const router = new Router();
const { authenticated } = require("../middlewares/auth");

router.get('/', mediaControllers.get)
router.get('/byId/:id', mediaControllers.getById)
router.post('/update/:id', mediaControllers.update)
router.post('/create', authenticated, mediaControllers.create)
router.get('/byUser', authenticated, mediaControllers.getByUser)
router.delete('/deleteAll', authenticated, mediaControllers.deleteAll)


module.exports = router