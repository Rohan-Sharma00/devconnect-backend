const express = require("express");
const connectionRequestRoutes = express.Router();
const { UserAuth } = require("../middleware/auth.js");
const {sendRequest,reviewRequest} = require("../controller/connectionRequests.controller.js");

connectionRequestRoutes.post("/send/:status/:userId",sendRequest);

connectionRequestRoutes.post("/review/:status/:requestId",reviewRequest);

module.exports = { connectionRequestRoutes } ;