const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.msg || "something went wrong ",
  };
  if (err.name === "ValidationError") {
    CustomError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    CustomError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    CustomError.msg = `duplicate value for ${Object.keys(err.keyValue)}`;
    CustomError.statusCode = 400;
  }
  if (err.name === "CastError") {
    CustomError.msg = `no item found with id:${err.value}`;
    CustomError.statusCode = 404;
  }
  res.status(CustomError.statusCode).json({ msg: CustomError.msg });
};
module.exports = errorHandlerMiddleware;
