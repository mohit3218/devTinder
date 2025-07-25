const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // Validation of data
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    } else {
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
      await loggedInUser.save();
      res.json({message: `${loggedInUser.firstName} your profile updated sucessfully`, data: loggedInUser});
    }
  } catch (err) {
    res.status(400).send(`Error: ${err}`);
  }
});

module.exports = profileRouter;
