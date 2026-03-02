const express = require("express");
const authRoutes = express.Router();
const { signUpUser , loginUser , forgotPasswordUser , logoutUser} = require("../controller/auth.controller");

authRoutes.post("/signUp",signUpUser );

authRoutes.post("/login", loginUser);

authRoutes.get("/logout", logoutUser);

authRoutes.post("/forgotPassword", forgotPasswordUser);



module.exports = { authRoutes } ;