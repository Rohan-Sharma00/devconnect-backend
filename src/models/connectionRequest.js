const mongoose = require("mongoose");
const { AppError }=require("../utils/AppError");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

      toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        validate:{
            validator:function(value){
                return value.toString() !== this.fromUserId.toString();
            },
            message:"cannot send request to yourself"
        }
    },

      status:{
        type: String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        },
        required:true
    },
},{timestamps:true});

connectionRequestSchema.pre("save",function (next){
    const connectionRequest = this;
       // validate user cannot send connection request to itself
        if(String(connectionRequest.fromUserId)===String(connectionRequest.toUserId)){
            throw new AppError("cannot send connection request to yourself",400);
        }
        next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = { ConnectionRequestModel };