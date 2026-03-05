const { AppError } = require("../utils/AppError.js");
const { convertResponseObj } = require("../utils/UtilFunctions.js");
const { UserModel } = require("../models/users");
const mongoose = require("mongoose");
const { ConnectionRequestModel } = require("../models/connectionRequest.js");

 const allowedInfoOfUser = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about",
        "location",
        "linkedin",
        "github",
        "portfolio",
        "instagram"
    ];

// get all pending requests of logged in user
const requestReceived = async (req,res,next) => {
    const loggedInUser = req.user;

    try{
        const connectionRequestArr =await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status:"interest"
        })
        .populate("fromUserId",allowedInfoOfUser)
        return res.send(convertResponseObj(connectionRequestArr,true,"All connection request fetched successfully"));

    }
    catch(err){
        next(err);
    }
};

const connections =async (req,res,next) =>{
     const loggedInUser = req.user;

    try{
        const connectionRequestArr =await ConnectionRequestModel.find({
            $or:[
                { toUserId : loggedInUser._id, status:"accept"},
                { fromUserId : loggedInUser._id, status:"accept"},
            ]
           
        })
        .populate("fromUserId",allowedInfoOfUser)
        .populate("toUserId",allowedInfoOfUser)

        const data = connectionRequestArr.map(user =>{ 
            if(user?.fromUserId?._id == loggedInUser._id )
                return user?.toUserId;
                else
                return user?.fromUserId;
        });

        return res.send(convertResponseObj(data,true,"All connection request fetched successfully"));

    }
    catch(err){
        next(err);
    }
};

const feed = () => {};

module.exports = { requestReceived , connections , feed};