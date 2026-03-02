const { viewProfile , EditProfile} = require("../controller/profile.controller");
const express = require("express");
const profileRoutes = express.Router();

profileRoutes.get("/view",viewProfile );

profileRoutes.patch("/edit", EditProfile);


module.exports = { profileRoutes } ;
