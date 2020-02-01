const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; //create array then choose [1] as token
  }
  //    else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  //Make sure token exists or sent
  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    req.user = await User.findById(decoded.id);
    next();
  } catch (e) {
    // console.log(e);
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
});

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // check if the role included is allowed (exist in ...roles above)
      return next(
        new ErrorResponse(
          `Users with a role of ${req.user.role} are NOT authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
