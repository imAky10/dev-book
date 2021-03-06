const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  from: { type: Date, required: true },
  to: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Experience", ExperienceSchema);
