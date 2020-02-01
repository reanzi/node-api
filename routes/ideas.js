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
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Idea, {
      path: "project",
      select: "name description"
    }),
    getIdeas
  )
  .post(protect, addIdea);
router
  .route("/:id")
  .get(getIdea)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

module.exports = router;
