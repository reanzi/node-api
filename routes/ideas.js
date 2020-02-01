const express = require("express");
const {
  getIdeas,
  getIdea,
  addIdea,
  updateIdea,
  deleteIdea
} = require("../controllers/ideas");

const Idea = require("../models/Idea");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

//Bring the protect Middleware
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Idea, {
      path: "project",
      select: "name description"
    }),
    getIdeas
  )
  .post(protect, authorize("publisher", "admin"), addIdea);
router
  .route("/:id")
  .get(getIdea)
  .put(protect, authorize("publisher", "admin"), updateIdea)
  .delete(protect, authorize("publisher", "admin"), deleteIdea);

module.exports = router;
