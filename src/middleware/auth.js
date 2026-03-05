const jwtTokenLibrary = require("jsonwebtoken");
const { UserModel } = require("../models/users");
const { AppError } = require("../utils/AppError");


const UserAuth = async (req, res, next) => {
    try {
        const { jwToken } = req.cookies;
        if (!jwToken) {
            return next(new AppError("Authentication Token is not valid", 400));
        }
        const decodedObj = jwtTokenLibrary.verify(jwToken, process.env.JWT_SECREAT_KEY);
        const { _id } = decodedObj;
        const userObj = await UserModel.findById(_id);
        if (!userObj) {
           return next( new AppError("User does not exist in database", 400));
        } else {
            req.user=userObj;
            next();
        }
    }
    catch (err) {
       return next(new AppError("Authentication failed", 401));
    }
}

module.exports = { UserAuth };

