const { RolePermission } = require('../models/rolePermission')

exports.getAll = async (req, res, next) => {
    
    try {
        const data =await RolePermission.find()
        res.json({data})
    } catch (err) {
        next(err)
    }
}

exports.create = async (req, res, next) => {
    
    const {role,permissions}=req.body
    try {
        
            const com = new RolePermission({role,permissions});
            await com.save();
      
        res.json({ message: 'کامنت با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

exports.addPermission = async (req, res, next) => {
    
    const {role,newPermission}=req.body
    try {
        
            const doc = await RolePermission.findOne({role});
            doc.permissions.push(newPermission)
            await doc.save();
      
        res.json({ message: 'پرمیژن با موفقیت ثبت شد' })
    } catch (err) {
        next(err)
    }
}

