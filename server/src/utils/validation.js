const validator = require("validator");
const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password) {
        throw new Error("All fields are required");
    }else if(firstName.length < 5 || !/^[A-Za-z]+$/.test(firstName)){
        throw new Error("First name must be at least 5 characters long and contain only letters");
    }else if(!validator.isEmail(email)){
        throw new Error("Invalid email format");
    }else if(!validator.isStrongPassword(password, {minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})){
        throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol");
    }
}; 


module.exports = {
    validateSignupData
};