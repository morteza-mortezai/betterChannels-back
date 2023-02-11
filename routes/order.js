const {Router}=require('express');
const orderControllers=require('../controllers/order')
const router=new Router();
const { authenticated } = require("../middlewares/auth");

router.put('/create',authenticated,orderControllers.create)
router.get('/byMediaId/:mediaId',authenticated,orderControllers.getByMediaId)
router.get('/all',authenticated,orderControllers.getAll)
router.delete('/byOrderId/:orderId',authenticated,orderControllers.delete)

module.exports=router

