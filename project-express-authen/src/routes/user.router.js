const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// Lấy danh sách tất cả người dùng (chỉ admin)
router.get("/" , authMiddleware, roleMiddleware("admin"), userController.getAllUsers);

// Lấy thông tin người dùng theo id (chỉ admin)
router.get("/:id", authMiddleware, roleMiddleware("admin"), userController.getUserById); 

// Cập nhật thông tin người dùng theo id (chỉ admin)
router.put("/:id", authMiddleware, roleMiddleware("admin"), userController.updateUser); 

// Xóa người dùng theo id (chỉ admin)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), userController.deleteUserById);

module.exports = router;