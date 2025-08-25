const mongoose = require("mongoose")

const uploadfileSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        ImageUrl: {
            type: String,
            required: [true, 'Image URL is required']
        },

        cloudinary_id: {
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