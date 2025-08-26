const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class authService {

    // Tạo user mới, mã hóa mật khẩu trước khi lưu
    async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new User({ ...data, password: hashedPassword });
        return user.save();
    }

    // Kiểm tra mật khẩu nhập vào với mật khẩu đã mã hóa
    async checkPassword(rawPassword, hashedPassword) {
        return bcrypt.compare(rawPassword, hashedPassword);
    }

    // Tìm user theo id
    async findById(id) {
        return User.findById(id).select("-Password");
    }

    // Tìm user theo Email
    async findByEmail(Email) {
        return User.findOne({ Email }, "-Password");
    }

    // Tạo token reset password và lưu vào user
    async generateResetToken(Email) {
        const user = await User.findOne({ Email });
        if (!user) return null;

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        return { user, token };
    }

    // Đặt lại mật khẩu mới bằng token
    async resetPassword(token, newPassword) {
        const user = await User.findOne({
            ResetToken: token,
            ResetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) return null;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.Password = hashedPassword;
        user.ResetToken = undefined;
        user.ResetTokenExpiration = undefined;
        await user.save();

        return user;
    }
}

module.exports = new authService();