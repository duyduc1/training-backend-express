const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload.middleware');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Upload một file mới
router.post('/uploadfile', authMiddleware, uploadMiddleware.single('image'), uploadController.uploadFile);

// Lấy danh sách tất cả file đã upload
router.get('/', authMiddleware, uploadController.getAllFile);

// Lấy thông tin file theo id
router.get('/:id', authMiddleware, uploadController.getFileById);

// Cập nhật thông tin file theo id
router.put('/:id', authMiddleware, uploadController.updateFile);

// Xóa file theo id
router.delete('/:id', authMiddleware, uploadController.deleteFile);

module.exports = router;