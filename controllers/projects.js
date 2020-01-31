const ErrorResponse = require("../utils/ErrorResponse");
const geocoder = require("../utils/geocoder");
const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");

// desc      Get all projects
// @router  GET /api/v1/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  let query;

  //copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude for matching
  const removeFields = ["select", "sort", "limit", "page"];

  //Loop over removeFields and delete from req.query
  removeFields.forEach(param => delete reqQuery[param]);

  // Create Query String
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($lt, lte, gt, gte, in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`); //1st $ is money sign

  //Finding Resource
  query = Project.find(JSON.parse(queryStr)).populate("ideas"); // populate with all idea's fields // populate with certain idea's fields

  /* // Select Fields to return
  query = Project.find(JSON.parse(queryStr)).populate({
    path: "ideas",
    select: "title description"
  }); */

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" "); // create a array from the req.query with split and join into string
    // console.log(fields);
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Project.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Excuting the query
  const projects = await query;

  // Pagination Results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  //Send Responses
  res.status(200).json({
    success: true,
    count: projects.length,
    pagination,
    data: projects
  });
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
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }
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
