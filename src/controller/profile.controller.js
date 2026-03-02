const { UserModel } = require("../models/users");
const { AppError } = require("../utils/AppError.js");
const { FilterObj } = require("../utils/UtilFunctions.js");

const viewProfile = () => { }

const EditProfile = async (req,res) => {
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
        "socialLinks"
    ];
    try {
        const filteredObj = FilterObj(allowedUpdateFields, req.body);
        const data = await UserModel.findByIdAndUpdate(userId, filteredObj, { runValidators: true, returnDocument: "after" });
        res.status(200).send(data);
    }
    catch (err) {
        throw new AppError(err,400);
    }
}

module.exports = { viewProfile, EditProfile };