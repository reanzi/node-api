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

router
  .route("/")
  .get(
    advancedResults(Idea, {
      path: "project",
      select: "name description"
    }),
    getIdeas
  )
  .post(addIdea);
router
  .route("/:id")
  .get(getIdea)
  .put(updateIdea)
  .delete(deleteIdea);

module.exports = router;
