const {Router}=require('express');
const orderComControllers=require('../controllers/orderComment')
const router=new Router();
const { authenticated } = require("../middlewares/auth");

router.put('/create',authenticated,orderComControllers.create)
router.get('/byOrderId/:orderId',authenticated,orderComControllers.getByOrderId)

module.exports=router

