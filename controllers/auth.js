const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ user: user.getName() });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
    res.cookie("jwt", token, { httpOnly: true });

    res.status(StatusCodes.OK).json({ user: { user: user._id } });
  } catch (error) {}
};
module.exports = { register, login };
