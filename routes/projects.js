const express = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsInRadius,
  projectPhotoUpload
} = require("../controllers/projects");

// Using Resources
/**
 * Include other Resources Routers
 */

const ideaRouter = require("./ideas");

const router = express.Router();

/**
 * Re-route into other resource routers
 */

router.use("/:projectId/ideas", ideaRouter);

// Routes
router.route("/radius/:zipcode/:distance").get(getProjectsInRadius);
router.route("/:id/photo").put(projectPhotoUpload);
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
