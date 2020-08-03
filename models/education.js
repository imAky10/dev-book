const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldofstudy: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Education", EducationSchema);
