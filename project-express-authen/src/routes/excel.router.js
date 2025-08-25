const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const excelController = require("../controllers/excel.controller");
const multer = require("multer");

const upload = multer({dest :"uploads/"});

// Đọc dữ liệu từ file Excel đã upload
router.post('/readexcel', authMiddleware, upload.single("file"), excelController.readExcell);

// Ghi dữ liệu vào file Excel mới
router.post('/writeexcel', authMiddleware, excelController.writeExcel);

module.exports = router;