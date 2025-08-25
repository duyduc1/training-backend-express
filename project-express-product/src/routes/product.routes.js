const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

// Lấy danh sách tất cả sản phẩm
router.get("/", controller.getProducts);

// Lấy thông tin sản phẩm theo id
router.get("/:id", controller.getProductsById);

// Tạo mới sản phẩm
router.post("/", controller.createProduct);

// Cập nhật thông tin sản phẩm theo id
router.put("/:id", controller.updateProduct);

// Xóa sản phẩm theo id
router.delete("/:id", controller.deleteProduct);

module.exports = router;