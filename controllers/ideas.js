const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Idea = require("../models/Idea");
const Project = require("../models/Project");

// desc      Get ideas
// @router  GET /api/v1/idea
// @router  GET /api/v1/projects/:projectId/ideas
// @access  Public

exports.getIdeas = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const ideas = await Idea.find({ project: req.params.projectId });

    /**
     * we return here because because pagination are not gonna be used for a single idea
     */
    return res.status(200).json({
      success: true,
      count: ideas.length,
      data: ideas
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
  req.body.user = req.user.id;

  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return next(
      new ErrorResponse(`No Project with the id of ${req.params.projectId}`),
      404
    );
  }

  //make sure the logged in user is the Project owner
  if (project.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to add an Idea to Project [ ${project.name} ]`,
        401
      )
    );
  }

  const idea = await Idea.create(req.body);

  res.status(200).json({
    success: true,
    data: idea
  });
});

// desc      Upadte idea
// @router  POST /api/v1//ideas/:id
// @access  Private

exports.updateIdea = asyncHandler(async (req, res, next) => {
  let idea = await Idea.findById(req.params.id);
  if (!idea) {
    return next(
      new ErrorResponse(`No Idea with the id of ${req.params.id}`),
      404
    );
  }
  //make sure the logged in user is the Idea owner or admin
  if (idea.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update this idea [ ${idea.title}]`,
        401
      )
    );
  }
  idea = await Idea.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: idea
  });
});

// desc      Delete idea
// @router  POST /api/v1//ideas/:id
// @access  Private

exports.deleteIdea = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) {
    return next(
      new ErrorResponse(`No Idea with the id of ${req.params.id}`),
      404
    );
  }
  //make sure the logged in user is the Idea owner or admin
  if (idea.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to Delete this  idea [ ${idea.title}]`,
        401
      )
    );
  }
  await idea.remove();

  res.status(200).json({
    success: true,
    data: ""
  });
});
