const {Router}=require('express');
const userControllers=require('../controllers/user')
const router=new Router();

router.post('/create',userControllers.create)
router.post('/login',userControllers.handleLogin)

module.exports=router