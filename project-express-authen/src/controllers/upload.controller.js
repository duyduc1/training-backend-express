const UploadService = require("../services/upload.service");
const response = require("../utils/response");

class uploadController {
    /**
     * Upload một file mới.
     * Kiểm tra file upload, lấy thông tin từ body và lưu file vào database.
     */
    async uploadFile(req, res, next) {
        try {
            if (!req.file) {
                const error = new Error("Please upload an file");
                error.statusCode = 400;
                throw error;
            }
            const { title, description } = req.body;
            const newFile = await UploadService.uploadFile({
                title,
                description,
                ImageUrl: req.file.path,
                cloudinary_id: req.file.filename,
            });
            response.success(res, newFile, { message: 'File uploaded successfully'});
        } catch (error) {
            next(error)
        }
    }

    /**
     * Lấy danh sách tất cả các file đã upload.
     */
    async getAllFile(req, res, next) {
        try {
            const file = await UploadService.getAllFiles();
            res.status(200).json({
                message: "All files",
                data: file
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy thông tin file theo id.
     * Kiểm tra id, trả về thông tin file nếu tồn tại.
     */
    async getFileById(req, res, next) {
        try {
            const { id } = req.params;
            const file = await UploadService.getFileById(id);
            if(!file) {
                const error = new Error('File not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "All files",
                data: file
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật thông tin file theo id.
     * Nhận dữ liệu mới từ body, cập nhật vào database.
     */
    async updateFile(req, res, next) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
            const updatedFile = await UploadService.updateFileById(id, { title, description });
            if(!updatedFile) {
                const error = new Error('File not found');
                error.statusCode = 404
                throw error;
            }
            res.status(200).json({
                message: "update successfull",
                data: updatedFile
            })
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xóa file theo id.
     * Kiểm tra id, xóa file nếu tồn tại.
     */
    async deleteFile(req, res, next) {
        try {
            const { id } = req.params;
            const deleteImage = await UploadService.deleteFileById(id);
            if(!deleteImage) {
                const error = new Error('File not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "deleted successfull"
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new uploadController();