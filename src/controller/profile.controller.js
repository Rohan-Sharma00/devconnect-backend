const { UserModel } = require("../models/users");
const { AppError } = require("../utils/AppError.js");
const { FilterObj, convertResponseObj } = require("../utils/UtilFunctions.js");

const viewProfile = async (req, res) => {
    try {
        const userObj = req?.user;
        res.status(200).send(convertResponseObj(userObj, true, "profile viwed successfully"));
    }
    catch (err) {
        throw new AppError(err, 400);
    }
}

const EditProfile = async (req, res) => {
    const userId = req?.user?._id;

    const allowedUpdateFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "mobileNo",
        "about",
        "location",
        "linkedin",
        "github",
        "portfolio",
        "instagram"
    ];
    try {
        const filteredObj = FilterObj(allowedUpdateFields, req.body);
        const data = await UserModel.findByIdAndUpdate(userId, filteredObj, {
            returnDocument: "after",   
            runValidators: true,      
            context: "query"          
        });
        res.status(200).send(convertResponseObj(data, true, "profile updated successfully"));
    }
    catch (err) {
        throw new AppError(err, 400);
    }
}

module.exports = { viewProfile, EditProfile };