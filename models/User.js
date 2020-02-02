const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user"
    /**
     * users => people who can write reviews on a project
     * publisher => people who can create projects & ideas
     */
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false // avoid return a psw in a api call
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Methods

/** ENCRYPTION MIDDLEWARE
 * Ecrypt Password using bcrypt
 */
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    // prevent errors when requesting to reset passowrd
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 *  SIGN JWT and Return
 */
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

//Match User entered Password to hashed password in db
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate Token
  const resetToken = crypto.randomBytes(25).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the token expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //token expire in 10min

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
