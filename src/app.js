const express = require('express')
const app = express()
const port = 8000

app.get('/user', (req, res) => {
  res.send({"firstName" : "Mohit", "lastName": "Thakur", "city": "ludhiana"});
})

app.post('/user', (req, res) => {
    res.send("User data has been saved successfully!!");
})

app.put('/user/:userId' , (req, res) => {
    res.send("User data has been updated successfully!!");
})

app.delete('/user/:userId', (req, res) => {
    res.send("User has been deleted successfully!!")
})

app.use("/test", (req, res) => {
    res.send('Hello from the server!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
