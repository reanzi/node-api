const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"]
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description Can not be more than 500 charaters"]
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS"
      ]
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"]
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ]
    },
    address: {
      type: String,
      required: [true, "Please add an address"]
    },
    location: {
      //GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
        required: false
      },
      coordinates: {
        type: [Number],
        required: false,
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    careers: {
      //   Array of strings
      type: [String],
      required: true,
      enum: [
        "Modern Agriculture",
        "Agriculture Development",
        "Technologies",
        "Laws",
        "Renewable Energy",
        "Resources Management",
        "Business",
        "UI/UX",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Others"
      ]
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating can not exceed 10"]
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg"
    },
    camping: {
      type: Boolean,
      default: true
    },
    requestFund: {
      type: Boolean,
      default: false
    },
    localized: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
/*
                       MIDDLEWARES
            */
//Create Project Slug from a name
ProjectSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode & create location field
ProjectSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipCode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  //Do not save address in db
  this.address = undefined;
  next();
});

/**
 * Cascade delete Ideas when a Project is deleted
 */
ProjectSchema.pre("remove", async function(next) {
  console.log(`Ideas being removed from Project ${this._id}`);
  await this.model("Idea").deleteMany({ project: this._id });
  next();
});

/**
 * Reverse Populate with Virtuals
 */
ProjectSchema.virtual("ideas", {
  // "ideas" field's name in the response data
  ref: "Idea",
  localField: "_id",
  foreignField: "project",
  justOne: false
});

module.exports = mongoose.model("Project", ProjectSchema);
