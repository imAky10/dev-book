const express = require("express");
const router = express.Router();
const moment = require("moment");

const { ensureAuthenticated } = require("../config/auth");
const Profile = require("../models/profile");
const Experience = require("../models/experience");
const Education = require("../models/education");
const User = require("../models/user");
const Post = require("../models/post");

router.get("/posts", ensureAuthenticated, async (req, res) => {
  const posts = await Post.find().populate("user").sort({ date: -1 });

  res.render("posts", {
    posts,
    moment: moment,
  });
});

router.get("/add-post", ensureAuthenticated, (req, res) => {
  res.render("addPost");
});

router.post("/add-post", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = new Post({
      title: req.body.title,
      text: req.body.post,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    const post = await newPost.save();

    res.redirect("/posts");
  } catch (err) {
    console.error(err);
    res.render("error");
  }
});

router.get("/post/:id", ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");

    res.render("post", {
      post,
      comments: post.comments,
      moment: moment,
    });
  } catch (err) {
    console.error(err);
    res.render("error");
  }
});

router.get("/delete-post/:id", (req, res) => {
  var id = req.params.id;
  Post.findByIdAndDelete(id, (err, post) => {
    if (err) console.log(err);
    else {
      res.redirect("/posts");
    }
  });
});

router.get("/edit-post/:id", async (req, res) => {
  var id = req.params.id;
  const post = await Post.findById(id);
  res.render("editPost", {
    post,
  });
});

router.post("/edit-post/:id", async (req, res) => {
  var id = req.params.id;
  var data = req.body;

  const post = await Post.findByIdAndUpdate(id, {
    title: data.title,
    text: data.post,
  });

  res.redirect(`/post/${id}`);
});

router.post("/add-comment/:id", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    const newComment = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    post.comments.unshift(newComment);

    await post.save();

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/delete-comment/:id/:comment_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.redirect(`/post/${post._id}`);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
