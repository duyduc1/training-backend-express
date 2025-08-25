const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class UserService {
    async getAllUsers() {
        return await User.find({});
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async updateUser(id , data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async deleteUserById(id) {
        return User.findByIdAndDelete(id);
    }

}

module.exports = new UserService();