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

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email id is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  } else if (skills?.length > 15) {
    throw new Error("Skills not allowed more the 15");
  }
};

const validateEditProfileData = (req) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    about,
    skills,
    photoUrl,
  } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (skills?.length > 15) {
    throw new Error("Skills not allowed more the 15");
  }
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];

  const isAllowedEditFields = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isAllowedEditFields;
};

module.exports = { validateSignUpData, validateEditProfileData };
