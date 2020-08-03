const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: { type: String },
  website: { type: String },
  location: { type: String },
  status: { type: String, required: true },
  skills: Array,
  bio: { type: String },
  githubusername: { type: String },

  social: {
    youtube: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    reddit: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
