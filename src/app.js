const express = require("express");
const app = express();
const port = 8000;

const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //Create a JWT Token
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder#790");
      // Add the token to cookie and send the response back to user
      res.cookie("token", token);

      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token");
    }

    const decodedMessage = await jwt.verify(token, "Dev@Tinder#790");
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

//Get User By E-mail
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send(`Ussr not found`);
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

// Feed API - Get /feed  - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send(`Ussr not found`);
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("Users deleted successfully");
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

// Update data of teh user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length) {
      throw new Error("Skills not allowed more the 15");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("Users deleted successfully");
  } catch (err) {
    res.status(400).send(`Something went wrong ${err}`);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established!!");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
  });
