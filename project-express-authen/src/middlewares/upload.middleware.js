const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cấu hình lưu trữ file trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'express-mongo-crud-uploads', // Thư mục lưu file trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Định dạng file cho phép
    },
});

// Khởi tạo middleware upload sử dụng multer với storage đã cấu hình
const upload = multer({ storage: storage})

// Xuất middleware upload để sử dụng cho route
module.exports = upload;