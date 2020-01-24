const express = require("express");
const dontenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

// Load env variables
dontenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

// Load Routes file
const projects = require("./routes/projects");

const app = express();

//Body Parser
app.use(express.json());

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/projects", projects);

const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV.toUpperCase()} mode on port ${PORT}`
      .yellow.bold
  )
);

//Handle 'Unhandled Promise Rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  //close Server & exit process
  server.close(() => process.exit(1)); // 1 exit with failure status
});
