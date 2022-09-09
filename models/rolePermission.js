const mongoose = require('mongoose');

//model
const rolePerSchema = new mongoose.Schema({
    role: {
        required:true,
        type:String,
     },
    permissions:[
        {
            path:String,
            method:String,
        }
 ]
   
});


const RolePermission = mongoose.model('RolePermission', rolePerSchema);
exports.RolePermission = RolePermission

