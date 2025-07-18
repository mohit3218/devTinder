const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("test", (req, res) => {
    res.send('Hello from the server!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
