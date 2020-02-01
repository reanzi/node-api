const path = require("path");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

/**
 *  @desc   Register a User
 *  @route  POST /api/v1/auth/register
 *  @access public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //   Create a user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  //Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});

/**
 *  @desc   Lgin a User
 *  @route  POST /api/v1/auth/login
 *  @access public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //   Validate email & Password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  //Check for user in DB
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});
