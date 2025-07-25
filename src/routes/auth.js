const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  const data = req.body;
  // Validation of data
  validateSignUpData(data);
  // Encrypt the password
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
  } = data;
  const passwordHash = await bcrypt.hash(password, 10);
  //Creating a new instance of the User model

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
    age,
    gender,
    about,
    skills,
    photoUrl,
  });
  try {
      const saveUser = await user.save();
      //Create a JWT Token
      const token = await saveUser.getJWT();
      // Add the token to cookie and send the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send({message: "User added successfully", data: saveUser});
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT();
      // Add the token to cookie and send the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      // res.json({result: true,message: "Login Successfully!!", data: user});
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout successfully!!");
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

module.exports = authRouter;
