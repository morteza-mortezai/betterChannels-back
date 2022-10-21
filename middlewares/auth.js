const jwt = require("jsonwebtoken");
const { User } = require('../models/user')
// const {RPP} =require('../models/RPP')
// const {Path} =require('../models/path')
const { RolePermission } = require('../models/rolePermission')
const { rp } = require('../utils/role-permission')
exports.authenticated = async (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            const error = new Error("مجوز کافی ندارید");
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(" ")[1]; //Bearer Token => ['Bearer', token]

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            const error = new Error("شما مجوز کافی ندارید");
            error.statusCode = 401;
            throw error;
        }
        const { userId } = decodedToken
        // get roleId
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error("خطا هویت");
            error.statusCode = 404;
            throw error;
        }
        //  path  method
        const path = req.originalUrl
        const method = req.method
        // superadmin
        if (user.role !== 'SUPERADMIN') {
            //permissions
            // const {permissions}=await RolePermission.findOne({role:user.role}).select('-_id -permissions._id') //from DB
            const permissions = rp[user.role]
            // compare
            if (permissions) {
                const pathMethod = {} // request
                pathMethod[path] = method // {'/media':'GET'}
                console.log('pathMethod', pathMethod)
                const index = permissions.findIndex((item) => {
                    return JSON.stringify(item) == JSON.stringify(pathMethod)
                })
                if (index == -1) {
                    const error = new Error("دسترسی ندارید111");
                    error.statusCode = 403;
                    throw error;
                }
            } else {
                const error = new Error("222دسترسی ندارید");
                error.statusCode = 403;
                throw error;
            }
        }
        req.userId = userId;
        next();
    } catch (err) {
        next(err);
    }
};
