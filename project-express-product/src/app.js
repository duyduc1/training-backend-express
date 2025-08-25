const express = require("express");
const routes = require("./routes");
const sequelize = require("../config/database");
const Product = require("./models/Product.model");
const morgan = require('morgan');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", routes);

sequelize.sync({ alter: true })
  .then(() => console.log("MySQL connected & synced"))
  .catch(err => console.error("DB error:", err));

module.exports = app;
