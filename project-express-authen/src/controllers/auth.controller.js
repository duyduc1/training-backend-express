const authService = require("../services/auth.service")
const response = require("../utils/response");
const { sendMail } = require("../utils/mailer");
const roles = require("../utils/roles");
const jwt = require("jsonwebtoken");

class authController {
    /**
     * Đăng ký tài khoản mới.
     * Kiểm tra email đã tồn tại chưa, nếu chưa thì tạo user mới.
     */
    async register(req, res, next) {
        try {
            const { Name, Email, Password, NumberPhone } = req.body;
            const existingUser = await authService.findByEmail(Email);
            if (existingUser) {
                return response.error(res, 'Email already exists', 400);
            }

            const newUser = await authService.create({
                Name,
                Email,
                Password,
                NumberPhone,
                Role: roles.USER
            });

            const verifiedUser = {
                id: newUser._id,
                name: newUser.Name,
                email: newUser.Email,
                numberphone: newUser.NumberPhone,
                role: newUser.Role,
            };

            response.created(res, { user: verifiedUser });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đăng nhập tài khoản.
     * Kiểm tra email và mật khẩu, trả về JWT token nếu thành công.
     */
    async login(req, res, next) {
        try {
            const { Email, Password } = req.body;
            const user = await authService.findByEmail(Email);
            if (!user) {
                return response.error(res, 'Invalid email or password', 401);
            }

            const isMatch = await authService.checkPassword(Password, user.Password);
            if (!isMatch) {
                return response.error(res, 'Invalid email or password', 401);
            }

            const token = jwt.sign(
                { id: user._id, email: user.Email, name: user.Name, numberphone: user.NumberPhone, Role: roles.USER },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' } 
            );
            
            const verifiedUser = {
                id: user._id,
                name: user.Name,
                email: user.Email,
                numberphone: user.NumberPhone,
                role: user.Role,
            };

            response.success(res, { token, user: verifiedUser });
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
            const { Email } = req.body;
            const result = await authService.generateResetToken(Email);
            if (!result) {
                return response.error(res, 'User not found', 404);
            }
            
            const resetUrl = `http://localhost:3001/api/auth/resetpass?token=${result.token}`;

            await sendMail(
                result.user.Email,
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
            const { Password } = req.body;
            const user = await authService.resetPassword(token, Password);
            if (!user) {
                return response.error(res, 'Email already exists', 400);
            }

            return response.success(res, { message: "Password hasbeen reset successfully" });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new authController();