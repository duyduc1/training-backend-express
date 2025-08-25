const Upload = require("../models/Upload.model");
const cloudinary = require("cloudinary").v2;

class imageService {
    // Upload file mới lên database
    async uploadFile(uploadfileData) {
        const newFile = new Upload(uploadfileData);
        return newFile.save();
    }

    // Lấy tất cả file đã upload
    async getAllFiles() {
        return Upload.find();
    }

    // Lấy file theo id
    async getFileById(id){
        return Upload.findById(id);
    }

    // Cập nhật thông tin file theo id
    async updateFileById(id, updateData){
        return Upload.findByIdAndUpdate(id, updateData, { new: true, runValidators: true});
    }

    // Xóa file theo id, đồng thời xóa trên Cloudinary
    async deleteFileById(id) {
        const file = await Upload.findById(id);
        if(!file) return null;

        await cloudinary.uploader.destroy(file.cloudinary_id);

        await Upload.findByIdAndDelete(id);
        return file;
    }
}

module.exports = new imageService();