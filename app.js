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
const allowedOrigins = ["https://jobsapi-167a3a6149c8.herokuapp.com/"];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(xss());

// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(errorHandlerMiddleware);

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
