const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();
require("./config/passport")(passport);

const app = express();

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to db");
  }
);

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

app.set("view engine", "ejs");

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use(express.static("public"));

// Routes
app.use("/", require("./routes/user"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/posts"));

app.get("*", (req, res) => {
  res.render("404");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
