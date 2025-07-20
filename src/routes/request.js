const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  //Sending a connection request
  console.log("Sending a connection request");

  res.send(user.firstName + " sent the connection request!");
});

module.exports = requestRouter;
