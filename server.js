const path = require("path");
const express = require("express");
const dontenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env variables
dontenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

// Load Routes file
const projects = require("./routes/projects");
const ideas = require("./routes/ideas");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

/**
 * MIDLEWARES
 */
//Body Parser
app.use(express.json());
app.use(cookieParser());

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File Upload
app.use(fileupload());

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/projects", projects);
app.use("/api/v1/ideas", ideas);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler); // must be used after the target middleware {example project}

const PORT = process.env.PORT || 5000;
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
