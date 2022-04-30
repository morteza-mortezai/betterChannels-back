const {Router}=require('express');
const postControllers=require('../controllers/channel')
const router=new Router();
router.get('/',postControllers.get)
router.post('/create',postControllers.create)
module.exports=router