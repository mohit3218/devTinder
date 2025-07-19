const express = require('express')
const app = express()
const port = 8000

const { adminAuth } = require("./middlewares/auth")


//app.use("/admin", adminAuth); //To Make all Admin Route authorized

app.get('/user', (req, res, next) => {
  res.send({"firstName" : "Mohit", "lastName": "Thakur", "city": "ludhiana"});
})

app.post('/admin/user', (req, res, next) => {
    res.send("User data has been saved successfully!!");
})

app.put('/admin/user/:userId' , (req, res, next) => {
    res.send("User data has been updated successfully!!");
})

app.delete('/admin/user/:userId', (req, res, next) => {
    res.send("User has been deleted successfully!!")
})

app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("Something went wrong");
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
