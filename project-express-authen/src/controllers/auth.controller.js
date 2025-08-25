const authService = require("../services/auth.service")
const response = require("../utils/response");
const { sendMail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");

class AuthController {
    /**
     * Đăng ký tài khoản mới.
     * Kiểm tra email đã tồn tại chưa, nếu chưa thì tạo user mới.
     */
    async register(req, res, next) {
        try {
            const {name, email, password, numberphone} = req.body;
            const existingUser = await authService.findByEmail(email);
            if(existingUser) {
                return response.error(res, 'Email already exists', 400);
            }

            const newUser = await authService.create({name, email, password, numberphone, role: "user"});

            response.created(res, { user : { id: newUser._id, name: newUser.name, email: newUser.email, numberphone: newUser.numberphone, role: newUser.role }});
        } catch (error) {
            next(error);
        }
    }

    const ROLES = {
        USER: 'user'
    }

    /**
     * Đăng nhập tài khoản.
     * Kiểm tra email và mật khẩu, trả về JWT token nếu thành công.
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await authService.findByEmail(email);
            if (!user) {
                return response.error(res, 'Invalid email or password', 401);
            }

            const isMatch = await authService.checkPassword(password, user.password);
            if (!isMatch) {
                return response.error(res, 'Invalid email or password', 401);
            }

            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.name, numberphone: user.numberphone, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' } 
            );  

            response.success(res, { token, user: { id: user._id, name: user.name, email: user.email, numberphone: user.numberphone, role: user.role} });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xử lý callback đăng nhập bằng Google.
     * Tạo JWT token và redirect về client.
     */
    async googleCallback(req, res, next) {
        try {
            const user = req.user;

            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.name, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.redirect(`http://localhost:3000?token=${token}`)
        } catch (error) {
            next(error);
        }
    }

    /**
     * Gửi email yêu cầu đặt lại mật khẩu.
     * Tạo token reset và gửi link qua email.
     */
    async forgorPassword(req, res, next) {
        try {
            const { email } = req.body;
            const result = await authService.generateResetToken(email);
            if (!result) {
                return response.error(res, 'User not found', 404);
            }
            
            const resetUrl = `http://localhost:3001/api/auth/resetpass?token=${result.token}`;

            await sendMail(
                result.user.email,
                "Password Reset Request",
                `<p>You requested a password reset. Click below:</p>
                <a href="${resetUrl}">${resetUrl}</a>`
            );

            return response.success(res, { message: "Reset password link has been sent" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đặt lại mật khẩu mới bằng token.
     * Kiểm tra token và cập nhật mật khẩu mới cho user.
     */
    async resetPassword(req, res, next) {
        try {
            const token = req.query.token;
            const { password } = req.body;
            const user = await authService.resetPassword(token, password);
            if (!user) {
                return response.error(res, 'Email already exists', 400);
            }

            return response.success(res, { message: "Password hasbeen reset successfully" });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController();