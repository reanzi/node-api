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
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User", //model used
    required: true
  }
});

IdeaSchema.statics.getAverageCost = async function(projectId) {
  //   console.log("Calculating Average Cost...".blue);
  const obj = await this.aggregate([
    {
      $match: { project: projectId }
    },
    {
      $group: {
        _id: "$project",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);
  try {
    await this.model("Project").findByIdAndUpdate(projectId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (e) {
    console.eror(e);
  }
};

//Call getAverageCost after save
IdeaSchema.post("save", function() {
  this.constructor.getAverageCost(this.project);
});

//Call getAverageCost before remove
IdeaSchema.pre("remove", function() {
  this.constructor.getAverageCost(this.project);
});

module.exports = mongoose.model("Idea", IdeaSchema);
