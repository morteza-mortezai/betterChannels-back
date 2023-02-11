const {Router}=require('express');
const rpControllers=require('../controllers/rolePermission')
const router=new Router();
const { authenticated } = require("../middlewares/auth");

router.put('/create',authenticated,rpControllers.create)
router.put('/addPermission',authenticated,rpControllers.addPermission)
router.get('/all',authenticated,rpControllers.getAll)

module.exports=router


// لازم نیست احتمالا باید پاک بشه