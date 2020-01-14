const express = require("express");
const dontenv = require("dotenv");

// Load env variables
dontenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV.toUpperCase()} mode on port ${PORT}`
  )
);
