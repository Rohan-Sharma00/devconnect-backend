const jwtTokenLibrary = require("jsonwebtoken");
const { UserModel } = require("../models/users");
const { AppError } = require("../utils/AppError");


const UserAuth = async (req, res, next) => {
    try {
        const { jwToken } = req.cookies;
        if (!jwToken) {
            throw new AppError("Authentication Token is not valid", 400);
        }
        const decodedObj = jwtTokenLibrary.verify(jwToken, process.env.JWT_SECREAT_KEY);
        const { _id } = decodedObj;
        const userObj = await UserModel.findById(_id);
        if (!userObj) {
            throw new AppError("User does not exist in database", 400);
        } else {
            req.user=userObj;
            next();
        }
    }
    catch (err) {
        throw new AppError(err, 500);
    }
}

module.exports = { UserAuth };

