const express = require("express");
require('dotenv').config();
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
var cors = require('cors');
const port = process.env.PORT;
const http = require("http");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,

}));
app.use(express.json());
app.use(cookieParser());
// require("./utils/cronJobs");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established!!");
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!" , err);
  });
