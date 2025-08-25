const express = require('express');
const morgan = require('morgan');
const routes = require("./routes");
const cors = require("cors");
const session = require("express-session");

require("../config/passport");

const errorMiddleware = require("./middlewares/error.middleware");
const configureCloudinary = require("../config/cloudinary");
const passport = require('passport');

const app = express();

configureCloudinary();

app.use(session({
  secret: process.env.JWT_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;