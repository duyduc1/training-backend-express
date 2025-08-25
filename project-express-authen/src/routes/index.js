const express = require('express');
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const uploadRouter = require("./upload.router")
const excelRouter = require('./excel.router');

const router = express.Router();

// Định tuyến cho các chức năng của ứng dụng
router.use("/users", userRouter);    // Quản lý người dùng
router.use("/auth", authRouter);     // Xác thực và đăng nhập
router.use("/upload", uploadRouter); // Upload file
router.use("/excel", excelRouter);   // Xử lý file Excel

module.exports = router;