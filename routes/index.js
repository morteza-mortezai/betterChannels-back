const {Router}=require('express');
const postControllers=require('../controllers/posts')
const router=new Router();
router.get('/',postControllers.getAll)
router.get('/c',postControllers.create)
module.exports=router