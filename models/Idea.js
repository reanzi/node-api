const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    required: [true, "Please add a description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add a cost"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add skills neede"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarShipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true
  }
});

module.exports = mongoose.model("Idea", IdeaSchema);
