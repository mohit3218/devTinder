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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true
        });
        res.send("Users deleted successfully");
      } catch (err) {
        res.status(400).send(`Something went wrong ${err}`);
      }
})

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
