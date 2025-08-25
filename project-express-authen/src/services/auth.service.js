const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class AuthService {

    async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new User({ ...data, password: hashedPassword });
        return user.save();
    }

    async checkPassword(rawPassword, hashedPassword) {
        return bcrypt.compare(rawPassword, hashedPassword);
    }

    async findById(id) {
        return User.findById(id);
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async generateResetToken(email) {
        const user = await User.findOne({ email });
        if (!user) return null;

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        return { user, token };
    }

    async resetPassword(token, newPassword) {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) return null;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        return user;
    }
}

module.exports = new AuthService();