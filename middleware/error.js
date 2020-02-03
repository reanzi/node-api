const ErrorResponse = require("../utils/ErrorResponse");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //log to console for Dev
  console.log(err.stack.red);

  //mongoose bad ObjectId
  console.log(err);
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose Duplicate keys
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  //Mongoose Validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};
module.exports = errorHandler;
