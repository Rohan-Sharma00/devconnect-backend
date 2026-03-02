const { AppError } = require("../utils/AppError.js");
const { FilterObj, convertResponseObj } = require("../utils/UtilFunctions.js");
const { ConnectionRequestModel } = require("../models/connectionRequest.js");
const { UserModel } = require("../models/users");
const mongoose = require("mongoose");


const sendRequest = async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params["userId"];
        const status = req.params["status"];
        // validate status
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.send(convertResponseObj({}, false, "Invalid status type " + status));
        }
        // validate to user Id
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(404).send(convertResponseObj({}, false, "Invalid user id !"));
        }

        // validate user cannot send connection request to itself
        if(String(fromUserId)===String(toUserId)){
            return res.status(404).send(convertResponseObj({}, false, "cannot send connection request to yourself"));
        }

        // check user is present in database or not
        const toUser = UserModel.findById(toUserId);

        if(!toUser){
             return res.status(404).send(convertResponseObj({}, false, " User not found"));
        }


        // check existing connection request - user1 to user2 or user2 to user1
        const existingConnectionRequest = ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId }, // duplicate request
                { fromUserId: toUserId, toUserId: fromUserId } // target user is already have sent conenction request to user
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).send(convertResponseObj({}, false, "Connection request already exists !"));
        }
        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.send(convertResponseObj(data, true, "connection request send successfully "));

    }
    catch (err) {
        throw new AppError(err, 400);
    }
}

const reviewRequest = () => { }

module.exports = { sendRequest, reviewRequest };