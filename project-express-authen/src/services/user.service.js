const User = require("../models/User.model");

class userService {
    // Lấy danh sách tất cả người dùng
    async getAllUsers() {
        return await User.find({});
    }

    // Lấy thông tin người dùng theo id
    async getUserById(id) {
        return await User.findById(id);
    }

    // Cập nhật thông tin người dùng theo id
    async updateUser(id , data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    // Xóa người dùng theo id
    async deleteUserById(id) {
        return User.findByIdAndDelete(id);
    }

}

module.exports = new userService();