const { UserModel } = require("../models/users");
const { AppError } = require("../utils/AppError.js");
const bcrypt = require("bcrypt");
const { FilterObj } = require("../utils/UtilFunctions.js");
const { ValidateSignUp, ValidateLogin } = require("../utils/ValidatorFunctions.js");

const signUpUser = async (req, res, next) => {
    const allowedSignUpKeys = ["firstName", "lastName", "emailId", "userName", "password", "mobileNo"];
    try {
        const filteredObj = FilterObj(allowedSignUpKeys, req.body);
        ValidateSignUp(filteredObj);
        // password hashing
        const hashedPassword = bcrypt.hashSync(filteredObj.password, Number(process.env.SALT_ROUNDS) || 10);
        filteredObj.password = hashedPassword;
        const data = await UserModel.create(filteredObj);
        const userData = await UserModel.findById(data._id);
        res.status(200).send(userData);
    } catch (err) {
        next(err);
    }
}

const loginUser = async (req, res, next) => {
    const allowedSignUpKeys = ["emailId", "userName", "password", "mobileNo"];
    try {
        const filteredObj = FilterObj(allowedSignUpKeys, req.body);
        ValidateLogin(filteredObj);

        let userInfoObj = {};
        if (filteredObj.emailId) {
            userInfoObj = await UserModel.findOne({ emailId: filteredObj.emailId }).select("+password");
        } else if (filteredObj.userName) {
            userInfoObj = await UserModel.findOne({ userName: filteredObj.userName }).select("+password");
        } else {
            userInfoObj = await UserModel.findOne({ mobileNo: filteredObj.mobileNo }).select("+password");
        }

        if (!userInfoObj) {
            return res.status(404).send({ error: "Please enter valid credentials" });
        }
        // password comparing (shifted to schema methods)
        const isUserAuthenticated = userInfoObj.comparePasswords(filteredObj.password);

        if (isUserAuthenticated) {
            // generating token shifted to schema method

            const jwt = userInfoObj.generateJwt();

            res.cookie("jwToken", jwt, {
                httpOnly: true,     // Cannot access via JS or anything
                // secure: true,       // Only HTTPS
                sameSite: "strict", // Prevent CSRF
                maxAge: 24 * 60 * 60 * 1000 // 1 day cookie expire
            });
            res.status(200).send({ isSuccess: true });
        }
        else {
            throw new AppError("Please enter valid credentials", 400);
        }
    } catch (err) {
        next(err);
    }
}

const forgotPasswordUser = () => { }

const logoutUser = (req, res) => {
    res.cookie("jwToken", null, {
        httpOnly: true,     // Cannot access via JS or anything
        // secure: true,       // Only HTTPS
        sameSite: "strict", // Prevent CSRF
        expires: new Date(Date.now())// expire instantly
    });
    res.send({isSuccessful:true,message:"user logout successfully !"});
}

module.exports = { signUpUser, loginUser, forgotPasswordUser, logoutUser };