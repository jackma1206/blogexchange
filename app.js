const express = require("express");
const flash = require("connect-flash");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

const app = express();

//load routes
const users = require("./routes/users");
const posts = require("./routes/posts");

//Passport Config
require("./config/passport")(passport);
//DB Config
const db = require("./config/database");

//map global promise - get rid of warning
mongoose.Promise = global.Promise;

mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//body-parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//Method Override middleware
app.use(methodOverride("_method"));

//express-session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//use routes
app.use("/users", users);
app.use("/posts", posts);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "front"
  });
});

app.get("/signin", (req, res) => {
  res.render("signin", { layout: "front" });
});
app.get("/about", (req, res) => {
  res.render("about");
});

//Set Path for public folder
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000; //always have process.... for heroku

app.listen(port, () => {
  //es6 arrow function
  console.log(`Sever started on port ${port}`); //es6 back ticks so you dont need '+' to use variable
});
