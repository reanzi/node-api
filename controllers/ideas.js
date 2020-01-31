const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Idea = require("../models/Idea");
const Project = require("../models/Project");

// desc      Get ideas
// @router  GET /api/v1/idea
// @router  GET /api/v1/projects/:projectId/ideas
// @access  Public

exports.getIdeas = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.projectId) {
    query = Idea.find({ project: req.params.projectId });
  } else {
    query = Idea.find().populate({
      path: "project",
      select: "name description"
    });
  }
  const ideas = await query;

  res.status(200).json({
    success: true,
    count: ideas.length,
    data: ideas
  });
});

// desc      Get Single idea
// @router  GET /api/v1/idea/:id
// @access  Public

exports.getIdea = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id).populate({
    path: "project",
    select: "name description"
  });
  if (!idea) {
    return next(
      new ErrorResponse(`No idea with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: idea
  });
});

// desc      Create a idea
// @router  POST /api/v1/projects/:projectID/ideas
// @access  Private

exports.addIdea = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;

  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return next(
      new ErrorResponse(`No Project with the id of ${req.params.projectId}`),
      404
    );
  }
  const idea = await Idea.create(req.body);

  res.status(200).json({
    success: true,
    data: idea
  });
});
