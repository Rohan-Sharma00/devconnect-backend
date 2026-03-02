const mongoose = require("mongoose");
const validator = require("validator");
const jwToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlen: [3, "The first name should be at least 3"],
        required: [true, "first name is required"],
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    age: {
        type: Number,
        min: [18, "The minimum age should be at least 18"],
    },
    emailId: {
        type: String,
        lowercase: true,
        required: [true, "email id is required"],
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "Please enter valid email id"
        }
    },
    gender: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return ["male", "female", "other"].includes(value);
            },
            message: "The genders can only be male, female and other"
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        select: false
    },
    mobileNo: {
        type: String,
        trim: true,
        required: true,
    },
    photoUrl: {
        type: String,
        default: "https://ohmylens.com/wp-content/uploads/2017/06/dummy-profile-pic.png",
        trim: true
    },
    skills: {
        type: [String],
    },
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    }
}, { timestamps: true });

userSchema.methods.generateJwt = function () {
    const user = this;
    const jwt = jwToken.sign({ _id: user._id }, process.env.JWT_SECREAT_KEY, {
        expiresIn: process.env.JWT_Token_EXPIRY
    });
    return jwt;
}

userSchema.methods.comparePasswords = function (passwordInputeByUser) {
    const user = this;
    const hashedPassword = user.password;
    return bcrypt.compareSync(passwordInputeByUser, hashedPassword);
}

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };