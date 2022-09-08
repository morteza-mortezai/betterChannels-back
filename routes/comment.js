const {Router}=require('express');
const comControllers=require('../controllers/comment')
const router=new Router();
const { authenticated } = require("../middlewares/auth");

router.put('/create',authenticated,comControllers.create)

module.exports=router