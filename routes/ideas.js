const express = require("express");
const { getIdeas } = require("../controllers/ideas");

const router = express.Router({ mergeParams: true });

router.route("/").get(getIdeas);

module.exports = router;
