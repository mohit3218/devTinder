const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://learnnode:xeglXcgWpS2PbsMB@learnnode.c3j3ayd.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
