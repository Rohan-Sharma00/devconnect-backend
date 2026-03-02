const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "local";
dotenv.config({ path: `.env.${env}` });

const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { UserAuth } = require("./middleware/auth.js");

const { connectDB } = require("./config/databaseConn.js");
const express = require("express");
const server = express();
const { UserModel } = require("./models/users.js");
const { FilterObj } = require("./utils/UtilFunctions.js");
const { authRoutes } = require("./routes/auth.routes.js");

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

const globalLimiter = rateLimit({

   windowMs: 15 * 60 * 1000, // 15 minutes

   max: 50, // 100 requests per IP

   message: {
      message: "Too many requests. Try again later."
   },

   standardHeaders: true, // modern headers

   legacyHeaders: false   // disable old headers

}); // learn more about it later

server.use(express.json());
server.use(cookieParser());
server.use(require("helmet")()); // learn more about it later
server.use(globalLimiter);


// integrate auth routes
server.use("/auth", authRoutes);

// user auth middleware global support
server.use(UserAuth);


server.post("/getUserByEmail", async (req, res, next) => {
    const userEmailId = req.body.emailId;
    const data = await UserModel.find({ emailId: userEmailId });
    if (data.length != 0) {
        res.status(200).send(data);
    } else {
        res.status(404).send("No user present with this email");
    }
});

server.post("/addUser", async (req, res, next) => {
    const data = await UserModel.create(req.body);
    if (data) {
        res.status(200).send(data);
    } else {
        res.status(500).send("Error while storing data");
    }
});

server.get("/getAllUser", async (req, res, next) => {
    try {
        const allData = await UserModel.find();
        res.status(200).send(allData);

    } catch (error) {
        console.log(error);
    }
});

server.delete("/deleteUser", async (req, res, next) => {
    try {
        const deletedData = await UserModel.deleteOne({ _id: req.body.userId });
        res.status(200).send(deletedData);
    } catch (error) {
        res.status(400).send("No user with id ", req.body.userId);
    }
});

server.patch("/updateUser/:id", async (req, res, next) => {
    const userId = req.params["id"];
    const allowedUpdate = ["age", "gender", "password", "photoUrl", "skills", "mobileNo"];
    try {
        const filteredObj = FilterObj(allowedUpdate, req.body);
        const data = await UserModel.findByIdAndUpdate(userId, filteredObj, { runValidators: true, new: true });
        res.status(200).send(data);
    }
    catch (err) {
        throw new Error(err);
    }
});


// error handling middleware

server.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong"
    });
});


