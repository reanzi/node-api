// @desc    Get all Projects
// @router  GET /api/v1/projects
// @access  Public
exports.getProjects = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all projects" });
};

// @desc    GEt single Project
// @router  GET /api/v1/projects/:id
// @access  Public
exports.getProject = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Get Single project ${req.params.id}` });
};

// @desc    Create new Project
// @router  POST /api/v1/projects
// @access  Private
exports.createProject = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new project" });
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