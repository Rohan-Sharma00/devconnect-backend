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
const { convertResponseObj } = require("./utils/UtilFunctions.js");
const { authRoutes } = require("./routes/auth.routes.js");
const { profileRoutes } = require("./routes/profile.routes.js");
const { connectionRequestRoutes } = require("./routes/connectionRequests.routes.js");
const { userRoutes } = require("./routes/user.routes.js");


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


// all auth routes
server.use("/", authRoutes);

// user auth middleware global support
server.use(UserAuth);

// all profile routes
server.use("/profile", profileRoutes);

// all connection requests routes
server.use("/request", connectionRequestRoutes);

// all connection requests routes
server.use("/user", userRoutes);




server.get("/getAllUser", async (req, res, next) => {
    try {
        const allData = await UserModel.find();
        res.status(200).send(allData);

    } catch (error) {
        console.log(error);
    }
});


// error handling middleware

server.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json(
        convertResponseObj(
            null,
            false,
            "Error : "+err.message || "Something went wrong"
        )
    );
});


