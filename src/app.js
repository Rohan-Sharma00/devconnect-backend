const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "local";
dotenv.config({ path: `.env.${env}` });

const { connectDB } = require("./config/databaseConn.js");
const express = require("express");
const server = express();
const { UserModel } = require("./models/users.js");

const startServer = async () => {
    console.log("Loaded ENV:", process.env.ENV_NAME);
    try {
        await connectDB();
        server.listen(process.env.PORT, () => {
            console.log("Server running on port ", process.env.PORT);
        });
    } catch (error) {
        console.log("problem in starting server");
    }
};
startServer();

server.use(express.json());

server.post("/signUp",async  (req, res) => {
    console.log(req.body);
    const user=new UserModel(req.body);
    await user.save();
    res.send("Data added successfully");
});

// error handling middleware

server.use("/", (err, req, res, next) => {
    res.status(500).send(err + "something went wrong MIDDLEWARE");
});


