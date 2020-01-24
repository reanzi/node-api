const Project = require("../models/Project");
// @desc    Get all Projects
// @router  GET /api/v1/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

// @desc    GEt single Project
// @router  GET /api/v1/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(400).json({ success: false }); // return to avoid "header already set" Error
    }
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create new Project
// @router  POST /api/v1/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (e) {
    console.log(`Error Message: ${e.errmsg} \nError Code: ${e.code}`);
    res.status(400).json({ success: false });
  }
};
// @desc    Update single Project
// @router  PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update project ${req.params.id}` });
};
// @desc    Delete single Project
// @router  DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete project ${req.params.id}` });
};
