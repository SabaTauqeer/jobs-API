const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log(authHeader);
    throw new UnauthenticatedError("please provide credentials");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    console.log(payload);

    next();
  } catch (error) {
    console.log(error);
    res.send(UnauthenticatedError("plaease provide credntials"));
  }
};
module.exports = auth;
