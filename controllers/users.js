const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

/**
 *  @desc   Get all Users
 *  @route  GET /api/v1/auth/users
 *  @access private/admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 *  @desc   Get Single User
 *  @route  GET /api/v1/auth/users/id
 *  @access private/admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

/**
 *  @desc   Create a User
 *  @route  POST /api/v1/auth/users
 *  @access private/admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

/**
 *  @desc   Update a User
 *  @route  PUT /api/v1/auth/users/:id
 *  @access private/admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: user });
});
/**
 *  @desc   Delete a User
 *  @route  DELETE /api/v1/auth/users/:id
 *  @access private/admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: "User deleted" });
});
