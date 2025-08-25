const express = require("express");
const router = express.Router();
const productRouter = require("./product.routes")

router.use("/products", productRouter);

module.exports = router;
