const mongoose = require("mongoose");
const { AppError } = require("../utils/AppError");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User",
        validate: {
            validator: function (value) {
                return value.toString() !== this.fromUserId.toString();
            },
            message: "cannot send request to yourself"
        }
    },

    status: {
        type: String,
        enum: {
            values: ["ignore", "interest", "accept", "reject"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    },
}, { timestamps: true });

// creating indexing to optimise performance
connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true, background: true }
);

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    // validate user cannot send connection request to itself
    if (String(connectionRequest.fromUserId) === String(connectionRequest.toUserId)) {
        throw new AppError("cannot send connection request to yourself", 400);
    }
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = { ConnectionRequestModel };