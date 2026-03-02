const express = require("express");
const authRoutes = express.Router();
const { UserAuth } = require("../middleware/auth.js");
const { signUpUser , loginUser , forgotPasswordUser , logoutUser, resetPasswordUser} = require("../controller/auth.controller");

authRoutes.post("/signUp",signUpUser );

authRoutes.post("/login", loginUser);

authRoutes.get("/logout", logoutUser);

authRoutes.post("/forgotPassword", forgotPasswordUser);

authRoutes.post("/resetPassword",UserAuth, resetPasswordUser);

module.exports = { authRoutes } ;