const {Router}=require('express');
const userControllers=require('../controllers/user')
const router=new Router();

router.post('/create',userControllers.create)

module.exports=router