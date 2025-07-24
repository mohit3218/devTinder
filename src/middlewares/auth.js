const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the request cookies
    const { token } = req.cookies;
    //Validate the token
    if (!token) {
      //throw new Error("Invalid token");
      return res.status(401).send("Please login!");
    }
    const decodedObj = await jwt.verify(token, "Dev@Tinder#790");
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
};

module.exports = { userAuth };
