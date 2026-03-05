const express = require("express");
const connectionRequestRoutes = express.Router();
const {sendRequest,reviewRequest} = require("../controller/connectionRequests.controller.js");

connectionRequestRoutes.post("/send/:status/:userId",sendRequest);

connectionRequestRoutes.post("/review/:status/:requestId",reviewRequest);

module.exports = { connectionRequestRoutes } ;