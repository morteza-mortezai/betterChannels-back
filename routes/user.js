const {Router}=require('express');
const userControllers=require('../controllers/user')
const router=new Router();

router.put('/create',userControllers.create)
router.post('/login',userControllers.handleLogin)
router.post('/verify',userControllers.verify)
router.post('/forgetPass',userControllers.forgetPass)
router.post('/resetPass',userControllers.resetPass)

module.exports=router