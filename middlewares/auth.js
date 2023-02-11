const jwt = require("jsonwebtoken");
const { User } = require('../models/user')
// const {RPP} =require('../models/RPP')
// const {Path} =require('../models/path')
const { rp } = require('../utils/role-permission')
exports.authenticated = async (req, res, next) => {

    console.log('step -2')
    const authHeader = req.get("Authorization");
    console.log('step -1')
    try {
        console.log('step 0')
        if (!authHeader) {
            const error = new Error("No token !");
            error.statusCode = 498;
            throw error;
        }
        console.log('step 1')
        const token = authHeader.split(" ")[1]; //Bearer Token => ['Bearer', token]

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('step 2')
        if (!decodedToken) {
            const error = new Error("Invalid token");
            error.statusCode = 498;
            throw error;
        }
        console.log('step 3')
        const { userId } = decodedToken

        // get roleId
        const user = await User.findById(userId)
        console.log('step 4')
        if (!user) {
            const error = new Error("User not Found");
            error.statusCode = 404;
            throw error;
        }
        console.log('step 5')
        //request  path and method
        const path = req.originalUrl
        const method = req.method
        console.log('step 6')
        // superadmin
        if (user.role !== 'SUPERADMIN') {
            //permissions
            // const {permissions}=await RolePermission.findOne({role:user.role}).select('-_id -permissions._id') //from DB
            const permissions = rp[user.role]
            console.log('step 7')
            // compare
            if (permissions && permissions.length > 0) {
                console.log('step 8')
                // const pathMethod = {} // request
                // pathMethod[path] = method // {'/media':'GET'}
                // console.log('pathMethod', pathMethod)
                const index = permissions.findIndex((item) => {
                    return item.path == path && item.method == method
                })
                console.log('step 9')
                if (index == -1) {
                    console.log('p a m', path, method)
                    console.log('permissions', permissions)
                    console.log('step 10')
                    const error = new Error("دسترسی ندارید111");
                    error.statusCode = 403;
                    throw error;
                }
            } else {
                console.log('step 11')
                const error = new Error("222دسترسی ندارید");
                error.statusCode = 403;
                throw error;
            }
        }
        req.userId = userId;
        next();
    } catch (err) {
        console.log('step 12')
        next(err);
    }
};
