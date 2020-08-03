const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String },
  text: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      name: { type: String },
      avatar: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
