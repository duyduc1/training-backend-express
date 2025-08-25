const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload.middleware');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/uploadfile', authMiddleware, uploadMiddleware.single('image'), uploadController.uploadFile);
router.get('/', authMiddleware, uploadController.getAllFile);
router.get('/:id', authMiddleware, uploadController.getFileById);
router.put('/:id', authMiddleware, uploadController.updateFile);
router.delete('/:id', authMiddleware, uploadController.deleteFile);

module.exports = router;