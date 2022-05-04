const {Router}=require('express');
const postControllers=require('../controllers/channel')
const router=new Router();
router.get('/',postControllers.get)
router.post('/create',postControllers.create)
router.get('/:id',postControllers.getById)
module.exports=router