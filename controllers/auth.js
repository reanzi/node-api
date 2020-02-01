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
