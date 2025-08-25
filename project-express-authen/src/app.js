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

// Cấu hình Cloudinary
configureCloudinary();

// Cấu hình session cho xác thực
app.use(session({
  secret: process.env.JWT_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// Cho phép truy cập từ các domain khác
app.use(cors());

// Parse dữ liệu JSON và form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ghi log request ra console
app.use(morgan('dev'));

// Khởi tạo passport cho xác thực
app.use(passport.initialize());
app.use(passport.session());

// Định tuyến API
app.use("/api", routes);

// Middleware xử lý lỗi
app.use(errorMiddleware);

module.exports = app;