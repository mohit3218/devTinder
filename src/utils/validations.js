const validator = require("validator");
const validateSignUpData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    about,
    skills,
    photoUrl,
  } = req;

  console.log(firstName + " - " + firstName);
  if(!firstName || !lastName){
    throw new Error("Name is not valid");
  }else if(!validator.isEmail(emailId)){
    throw new Error("Email id is not valid");
  }else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong");
  }else if (skills?.length > 15) {
    throw new Error("Skills not allowed more the 15");
  }
};

module.exports = {validateSignUpData}