const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
    console.log("server is connected to db")
  );
};

module.exports = connectDB;
