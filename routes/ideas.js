const express = require("express");
const {
  getIdeas,
  getIdea,
  addIdea,
  updateIdea,
  deleteIdea
} = require("../controllers/ideas");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getIdeas)
  .post(addIdea);
router
  .route("/:id")
  .get(getIdea)
  .put(updateIdea)
  .delete(deleteIdea);

module.exports = router;
