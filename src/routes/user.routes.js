const express = require("express");
const userRoutes = express.Router();
const { requestReceived , connections , feed} = require("../controller/user.controller");

userRoutes.get("/requests/received",requestReceived);

userRoutes.get("/connections",connections);

userRoutes.get("/feed",feed);


module.exports = { userRoutes } ;