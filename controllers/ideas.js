const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Idea = require("../models/Idea");

// desc      Get ideas
// @router  GET /api/v1/idea
// @router  GET /api/v1/projects/:projectId/ideas
// @access  Public

exports.getIdeas = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.projectId) {
    query = Idea.find({ project: req.params.projectId });
  } else {
    query = Idea.find();
  }
  const ideas = await query;

  res.status(200).json({
    success: true,
    count: ideas.length,
    data: ideas
  });
});
