const express = require("express");
const app = express();
const port = 8000;

const { connectDB } = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //Creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(`Something went wrong ${err?.code}`);
  }
});

//Get User By E-mail
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log("userEmail ", userEmail);
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
