const express = require("express");
const dontenv = require("dotenv");

// Load env variables
dontenv.config({ path: "./config/config.env" });

const app = express();

// Routes
app.get("/api/v1/projects", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all projects" });
});
app.get("/api/v1/projects/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Get Single project ${req.params.id}` });
});
app.post("/api/v1/projects", (req, res) => {
  res.status(200).json({ success: true, msg: "Create new project" });
});
app.put("/api/v1/projects/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update project ${req.params.id}` });
});
app.delete("/api/v1/projects/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete project ${req.params.id}` });
});

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV.toUpperCase()} mode on port ${PORT}`
  )
);
