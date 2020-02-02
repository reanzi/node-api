const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Review = require("../models/Review");
const Project = require("../models/Project");

// desc      Get Reviews
// @router  GET /api/v1/idea
// @router  GET /api/v1/projects/:projectId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const reviews = await Review.find({ project: req.params.projectId });

    // we return here because because pagination are not gonna be used for a single idea

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// desc      Get Single Review
// @router  GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "project",
    select: "name description"
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the ID of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// desc      Create Review
// @router  POST /api/v1/projects/:projectIDreviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;
  req.body.user = req.user.id;
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(`No Project with ID if ${req.params.projectId}`, 404)
    );
  }
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review
  });
});

// desc      Update Review
// @router  PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No Review with ID if ${req.params.id}`, 404)
    );
  }

  // Make sure Review belongs to user or user is an Admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`You're not Authorized to Update this Review`, 401)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// desc      Delete Review
// @router  PUT /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No Review with ID if ${req.params.id}`, 404)
    );
  }

  // Make sure Review belongs to user or user is an Admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`You're not Authorized to Update this Review`, 401)
    );
  }

  await Review.remove();

  res.status(200).json({
    success: true,
    data: "Review deleted"
  });
});
