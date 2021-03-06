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

const Project = require("../models/Project");

/**
 *      Using Resources
 * Include other Resources Routers
 */
const ideaRouter = require("./ideas");
const reviewRouter = require("./reviews");

const router = express.Router();

//Bring the protect Middleware
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
/**
 * Re-route into other resource routers
 * {{url}}/api/v1/projects/:projectID/-other-router
 */
router.use("/:projectId/ideas", ideaRouter);
router.use("/:projectId/reviews", reviewRouter);

// Routes
router.route("/radius/:zipcode/:distance").get(getProjectsInRadius);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), projectPhotoUpload);
router
  .route("/")
  .get(advancedResults(Project, "ideas"), getProjects) // using advancedResults middleware
  .post(protect, authorize("publisher", "admin"), createProject);

router
  .route("/:id")
  .get(getProject)
  .put(protect, authorize("publisher", "admin"), updateProject)
  .delete(protect, authorize("publisher", "admin"), deleteProject);

module.exports = router;
