const express = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsInRadius
} = require("../controllers/projects");

const router = express.Router();

// Routes
router.route("/radius/:zipcode/:distance").get(getProjectsInRadius);
router
  .route("/")
  .get(getProjects)
  .post(createProject);

router
  .route("/:id")
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
