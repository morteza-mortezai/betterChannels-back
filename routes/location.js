const {Router}=require('express');
const locControllers=require('../controllers/location')
const router=new Router();

router.post('/',locControllers.create)


module.exports=router