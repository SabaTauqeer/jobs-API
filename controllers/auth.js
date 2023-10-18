const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError,
} = require("../errors");

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      throw new BadRequestError("please provide complete crednetials");
    }
    const user = await User.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({ user: user.getName() });
  } catch (error) {
    res.send({ error });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      throw new BadRequestError("please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("invalid credentials");
    }
    const isPassCorrect = await user.checkPassword(password);
    if (!isPassCorrect) {
      throw new UnauthenticatedError("invalid credentials");
    }
    const token = user.createJWT();
    console.log("login");

    res.status(StatusCodes.OK).json({ user: { user: user.getName() }, token });
  } catch (error) {
    res.send({ error });
  }
};
module.exports = { register, login };
