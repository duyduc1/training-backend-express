const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },

        Email: {
            type: String,
            required: true,
            unique: true,
        },

        Password: { 
            type: String, 
            required: true 
        },

        NumberPhone: {
            type: Number,
            required: true,
        }, 

        Role: {
            type: String,
            enum: ["user", "admin"], 
            default: "user"          
        },

        ResetToken: String,
        ResetTokenExpiration: Date,

    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema);