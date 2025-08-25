const Upload = require("../models/Upload.model");
const cloudinary = require("cloudinary").v2;

class ImageService {
    async uploadFile(uploadfileData) {
        const newFile = new Upload(uploadfileData);
        return newFile.save();
    }

    async getAllFiles() {
        return Upload.find();
    }

    async getFileById(id){
        return Upload.findById(id);
    }

    async updateFileById(id, updateData){
        return Upload.findByIdAndUpdate(id, updateData, { new: true, runValidators: true});
    }

    async deleteFileById(id) {
        const file = await Upload.findById(id);
        if(!file) return null;

        await cloudinary.uploader.destroy(file.cloudinary_id);

        await Upload.findByIdAndDelete(id);
        return file;
    }
}

module.exports = new ImageService();