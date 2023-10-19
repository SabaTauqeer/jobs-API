require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
//extra security packages
// const helmet = require("helmet");
// const cors = require("cors");
// const xss = require("xss-clean");
// const ratelimit = require("express-rate-limit");
// //connectDB
const connnectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/errorhadler");
const authenticateUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const bodyParser = require("body-parser");

app.set("trust proxy", 1);
app.use(ratelimit({ windowMs: 15 * 601000, max: 100 }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connnectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
