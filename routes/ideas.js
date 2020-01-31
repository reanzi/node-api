const express = require("express");
const { getIdeas, getIdea, addIdea } = require("../controllers/ideas");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getIdeas)
  .post(addIdea);
router.route("/:id").get(getIdea);

module.exports = router;
