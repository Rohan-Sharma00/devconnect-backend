const validator = require("validator");
const { AppError } = require("./AppError");

function ValidateSignUp(userObj){
    // ["firstName","lastName","emailId","userName","password"]
   if(!validator.isAlpha(userObj.firstName) || !validator.isAlpha(userObj.lastName)) {
    throw new AppError("Firstname and LastName should be letters only",400); 
   }

    if(!validator.isEmail(userObj.emailId)){
         throw new AppError("Please enter valid email id",400); 
    }

    if(!validator.isAlphanumeric(userObj.userName) ){
         throw new AppError("userName should containes alphabets and numbser only",400); 
    }

}

module.exports = { ValidateSignUp } ;