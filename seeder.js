const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/config.env" });

//Load Models
const Project = require("./models/Project");
const Idea = require("./models/Idea");
const User = require("./models/User");
const Review = require("./models/Review");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read tha JSON file
const projects = JSON.parse(
  fs.readFileSync(
    `${__dirname}/resources/devcamper_project_resources/_data/bootcamps.json`,
    "utf-8"
  )
);

const ideas = JSON.parse(
  fs.readFileSync(
    `${__dirname}/resources/devcamper_project_resources/_data/courses.json`,
    "utf-8"
  )
);

const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/resources/devcamper_project_resources/_data/users.json`,
    "utf-8"
  )
);
const reviews = JSON.parse(
  fs.readFileSync(
    `${__dirname}/resources/devcamper_project_resources/_data/reviews.json`,
    "utf-8"
  )
);
// import into db
const importData = async () => {
  try {
    await Project.create(projects);
    await Idea.create(ideas);
    await User.create(users);
    await Review.create(reviews);
    console.log("Data Imported ....".green.inverse);
    process.exit();
  } catch (e) {
    console.error(e);
  }
};

//Delete Data from DB
const deleteData = async () => {
  try {
    await Project.deleteMany();
    await Idea.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed ....".red.inverse);
    process.exit();
  } catch (e) {
    console.error(e);
  }
};

if (process.argv[2] === "-import") {
  importData();
} else if (process.argv[2] === "-del") {
  deleteData();
}
