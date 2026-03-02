const express = require("express");
const authRoutes = express.Router();
const { signUpUser , loginUser} = require("../controller/auth.controller");

authRoutes.post("/signUp",signUpUser );

authRoutes.post("/login", loginUser);



module.exports = { authRoutes } ;