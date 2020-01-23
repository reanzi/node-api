const express = require("express");
const router = express.Router();

// Routes
router.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all projects" });
});
router.get("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Get Single project ${req.params.id}` });
});
router.post("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Create new project" });
});
router.put("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update project ${req.params.id}` });
});
router.delete("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete project ${req.params.id}` });
});

module.exports = router;
