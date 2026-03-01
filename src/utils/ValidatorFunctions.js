const validator = require("validator");
const { AppError } = require("./AppError");

function ValidateSignUp(userObj) {
     // ["firstName","lastName","emailId","userName","password"]
     if (!validator.isAlpha(userObj.firstName) || !validator.isAlpha(userObj.lastName)) {
          throw new AppError("Firstname and LastName should be letters only", 400);
     }

     if (!validator.isEmail(userObj.emailId)) {
          throw new AppError("Please enter valid email id", 400);
     }

     if (!validator.isAlphanumeric(userObj.userName)) {
          throw new AppError("userName should containes alphabets and numbser only", 400);
     }

     if (!validator.isStrongPassword(userObj.password)) {
          throw new AppError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.", 400);
     }

     if (!validator.isMobilePhone(userObj.mobileNo, "en-IN")) {
          throw new Error("Please enter a valid Indian mobile number");
     }

}

function ValidateLogin(userObj) {
     if (!userObj?.emailId && !userObj.mobileNo && !userObj.userName) {
          throw new AppError(
               "Provide emailId or mobileNo or userName",
               400
          );
     }
     if (userObj?.emailId && !validator.isEmail(userObj.emailId)) {
          throw new AppError("Please enter valid email id", 400);
     }

     if (userObj?.userName && !validator.isAlphanumeric(userObj.userName)) {
          throw new AppError("userName should containes alphabets and numbser only", 400);
     }

     if (!userObj?.password) {
          throw new AppError("password field is mandatory", 400);
     }

     if (userObj?.mobileNo && !validator.isMobilePhone(userObj.mobileNo, "en-IN")) {
          throw new AppError("Please enter a valid Indian mobile number",400);
     }
}

module.exports = { ValidateSignUp, ValidateLogin };