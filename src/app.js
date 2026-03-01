const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "local";
dotenv.config({ path: `.env.${env}` });

const { AppError } = require("./utils/AppError.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwToken = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./config/databaseConn.js");
const express = require("express");
const server = express();
const { UserModel } = require("./models/users.js");
const { FilterObj } = require("./utils/UtilFunctions.js");
const { ValidateSignUp, ValidateLogin } = require("./utils/ValidatorFunctions.js");

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

   max: 100, // 100 requests per IP

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

server.post("/signUp", async (req, res, next) => {
    const allowedSignUpKeys = ["firstName", "lastName", "emailId", "userName", "password", "mobileNo"];
    try {
        const filteredObj = FilterObj(allowedSignUpKeys, req.body);
        ValidateSignUp(filteredObj);
        // password hashing
        const hashedPassword = bcrypt.hashSync(filteredObj.password, Number(process.env.SALT_ROUNDS) || 10);
        filteredObj.password = hashedPassword;
        const data = await UserModel.create(filteredObj);
        const userData = await UserModel.findById(data._id);
        res.status(200).send(userData);
    } catch (err) {
        next(err);
    }
});

server.post("/login", async (req, res, next) => {
    const allowedSignUpKeys = ["emailId", "userName", "password", "mobileNo"];
    try {
        const filteredObj = FilterObj(allowedSignUpKeys, req.body);
        ValidateLogin(filteredObj);

        let userInfoObj = {};
        if (filteredObj.emailId) {
            userInfoObj = await UserModel.findOne({ emailId: filteredObj.emailId }).select("+password");
        } else if (filteredObj.userName) {
            userInfoObj = await UserModel.findOne({ userName: filteredObj.userName }).select("+password");
        } else {
            userInfoObj = await UserModel.findOne({ mobileNo: filteredObj.mobileNo }).select("+password");
        }

        if (!userInfoObj) {
            res.status(404).send({ error: "Please enter valid credentials" });
        }
        // password comparing
        const isUserAuthenticated = bcrypt.compareSync(filteredObj.password, userInfoObj.password);
        if (isUserAuthenticated) {
            // generating token
            const jwt = jwToken.sign({ _id: userInfoObj._id }, process.env.JWT_SECREAT_KEY, {
                expiresIn: "1d" // expire jwt after 1 day
            });
            res.cookie("jwToken", jwt, {
                httpOnly: true,     // Cannot access via JS or anything
                // secure: true,       // Only HTTPS
                sameSite: "strict", // Prevent CSRF
                maxAge: 24 * 60 * 60 * 1000 // 1 day cookie expire
            });
            res.status(200).send({ isSuccess: true });
        }
        else {
            throw new AppError("Please enter valid credentials", 400);
        }
    } catch (err) {
        next(err);
    }
});

// error handling middleware

server.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong"
    });
});


