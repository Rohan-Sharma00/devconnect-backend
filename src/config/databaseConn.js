const mongoose=require("mongoose");

const DATABASE_URL = process.env.DATABASE_URL;

const connectDB=async ()=>{
    try{
    await mongoose.connect(DATABASE_URL);
    console.log("database connected successfully");
    }
    catch(error){
        console.log("Error while connecting to database",error);
    }
};

module.exports={ connectDB };