const mongoose = require("mongoose")

const uploadfileSchema = new mongoose.Schema(
    {
        Title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },

        Description: {
            type: String,
            required: true,
            trim: true,
        },

        ImageUrl: {
            type: String,
            required: [true, 'Image URL is required']
        },

        CloudinaryId: {
            type: String,
            required: [true, 'Cloudinary ID is required'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('File', uploadfileSchema);