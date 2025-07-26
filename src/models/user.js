const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Invalid email address ${value}`);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(`Your password is not strong ${value}`);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: { 
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`
    },
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    isPremium:{
      type:Boolean,
      default: false,
    },
    membershipType:{
      type:string
    },
    about: {
      type: String,
      default: "This is a default value of the user!",
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(`Invalid photo URL ${value}`);
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1}); //Compound index

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder#790", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
