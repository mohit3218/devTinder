const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");

const requestRouter = express.Router();

const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      //If there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exist!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      //Commented due to no configured email varification on E-Mail
      //const emailRes = await sendEMail.run();

      
      res.json({
        message:
          req.user.firstName + " is" + " interested in" + toUser.firstName,
        data,
      });
      //res.send(user.firstName + " sent the connection request!");
    } catch (err) {
      res.status(400).send(`Error: ${err}`);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const {status, requestId} = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }
      //console.log("Id : ", requestId, " | toUserId : ", loggedInUser._id)
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
      })

      if(!connectionRequest){
        return res.status(404).json({
          "message": "Connection request not found"
        })
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({message: "Connection request " + status, data})

      
    } catch (err) {
      res.status(400).send(`Error: ${err}`);
    }
  }
);

module.exports = requestRouter;
