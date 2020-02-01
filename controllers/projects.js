const path = require("path");
const ErrorResponse = require("../utils/ErrorResponse");
const geocoder = require("../utils/geocoder");
const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");

// desc      Get all projects
// @router  GET /api/v1/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  //Send Responses
  res.status(200).json(res.advancedResults);
});

// @desc    GEt single Project
// @router  GET /api/v1/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate("ideas");

  if (!project) {
    // return to avoid "header already set" Error
    // formatted objectId but not found in db
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create new Project
// @router  POST /api/v1/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  //Check for published project
  const publishedProject = await Project.findOne({ user: req.user.id });

  // If the user is not an Admin, they can only add only one project
  if (publishedProject && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already submitted a project`,
        400
      )
    );
  }

  const project = await Project.create(req.body);
  res.status(201).json({
    success: true,
    data: project
  });
});
// @desc    Update single Project
// @router  PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id, req.body);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project owner
  if (project.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this Project`,
        401
      )
    );
  }

  // then update
  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: project });
});

// @desc    Delete single Project
// @router  DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure the user is the owner of a project or an Admin
  if (project.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with ID ${req.params.id} is not authorized to delete this Project`,
        401
      )
    );
  }
  //then delete the project
  project.remove();
  res.status(200).json({ success: true, msg: "Document Deleted" });
});

// @desc    Get projects within a radius
// @router  DELETE /api/v1/projects/radius/:zipcode/:distance
// @access  Private
exports.getProjectsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lang from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radius
  //Divide distance by radius of earth
  //Earth Radius = 3,963 mi /6,378 km

  const radius = distance / 6378;
  const projects = await Project.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Upload Photo for a Project
// @router  DELETE /api/v1/projects/:id/photo
// @access  Private
exports.projectPhotoUpload = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 400));
  }

  console.log(req.files);
  const file = req.files.file;

  //make sure image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please Upload an image file`, 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        `Please Upload an image less than ${process.env.MAX_FILE_UPLOAD_SIZE /
          1000000}MB`,
        400
      )
    );
  }

  //Custom file name
  file.name = `photo_${project._id}${Math.random()}_${Date.now()}${
    path.parse(file.name).ext
  }`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with the file upload`, 500));
    }
    // Insert filename into the db
    await Project.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
