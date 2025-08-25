const express = require("express");
const routes = require("./routes");
const sequelize = require("../config/database");
const Product = require("./models/Product.model");
const morgan = require('morgan');
const cors = require("cors");

const app = express();

// Cho phép truy cập từ các domain khác
app.use(cors());

// Parse dữ liệu JSON
app.use(express.json());

// Ghi log request ra console
app.use(morgan('dev'));

// Định tuyến API
app.use("/api", routes);

// Kết nối và đồng bộ database với Sequelize
sequelize.sync({ alter: true })
  .then(() => console.log("MySQL connected & synced"))
  .catch(err => console.error("DB error:", err));

module.exports = app;