const mongoose = require("mongoose");
const validator = require("validator");
const jwToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlen: [3, "The first name should be at least 3"],
        maxlength: [30, "first name is  too long"],
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
        unique: true,
    },
    photoUrl: {
        type: String,
        default: "https://ohmylens.com/wp-content/uploads/2017/06/dummy-profile-pic.png",
        trim: true
    },
    skills: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length <= 20;
            },
            message: "Maximum 20 skills allowed"
        }
    },
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        minlength: [3, "Username too short"],
        maxlength: [30, "Username too long"],
    },
    about: {
        type: String,
        trim: true,
        maxlength: [500, "About cannot exceed 500 characters"]
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: {
            values: ["user", "admin"],
            message: "Role must be user or admin"
        },
        default: "user"
    },

    accountStatus: {
        type: String,
        enum: {
            values: ["active", "blocked"],
            message: "Account status must be active or blocked"
        },
        default: "active"
    },

    lastLogin: {
        type: Date
    },

    location: {
        type: String,
        trim: true,
        maxlength: [100, "Location too long"]
    },
    linkedin: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return !value || validator.isURL(value, {
                    protocols: ["http", "https"],
                    require_protocol: true
                });
            },
            message: "Invalid LinkedIn URL"
        }
    },

    github: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return !value || validator.isURL(value, {
                    protocols: ["http", "https"],
                    require_protocol: true
                });
            },
            message: "Invalid Github URL"
        }
    },

    portfolio: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return !value || validator.isURL(value, {
                    protocols: ["http", "https"],
                    require_protocol: true
                });
            },
            message: "Invalid Portfolio URL"
        }
    },

    instagram: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return !value || validator.isURL(value, {
                    protocols: ["http", "https"],
                    require_protocol: true
                });
            },
            message: "Invalid Instagram URL"
        }
    },

    profileCompletion: {
        type: Number,
        default: 0,
        min: [0, "Profile completion cannot be less than 0"],
        max: [100, "Profile completion cannot exceed 100"]
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