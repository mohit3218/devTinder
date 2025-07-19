const express = require("express");
const app = express();
const port = 8000;

const { connectDB } = require("./config/database");
const User = require("./models/user")

app.use(express.json());

app.post("/signup" , async (req, res) => {
    //Creating a new instance of the User model
    const user = new  User(req.body)
    try{
        await user.save();
        res.send("User added successfully")
    }catch(err){
        res.status(400).send(`Something went wrong ${err?.code}`)
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

  
