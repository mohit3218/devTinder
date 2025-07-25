const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User", //refernce to the user collection
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User", //refernce to the user collection
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending" ,"ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

//ConnectionRequest.find({fromUserId: 7986487348742, toUserId: 4834938249382432})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1}); //Compound index
//Every time ran befor save method call in API
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    //Check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = { ConnectionRequest };
