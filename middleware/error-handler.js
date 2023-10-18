const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //defualt values
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err,
  };

  if (err.name === "CastError") {
    customError.message = `no item found with id: ${err.value}`;
    customError.statusCode = 404;
  }
  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");

    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.message = `please provide another value for ${Object.keys(
      err.keyValue
    )}`;
    customError.statusCode = 400;
  }
  return res.status(customError.statusCode).json({ response: customError.msg });
};

module.exports = errorHandlerMiddleware;
