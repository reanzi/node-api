const express = require("express");
const dontenv = require("dotenv");
const morgan = require("morgan");

// Load Routes file
const projects = require("./routes/projects");

// Load env variables
dontenv.config({ path: "./config/config.env" });

const app = express();

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/projects", projects);

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV.toUpperCase()} mode on port ${PORT}`
  )
);
