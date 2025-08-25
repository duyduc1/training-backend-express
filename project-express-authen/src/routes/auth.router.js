const express = require("express");
const authController = require("../controllers/auth.controller");
const passport = require("passport");

const router = express.Router();

// Đăng ký tài khoản mới
router.post("/register", authController.register);

// Đăng nhập tài khoản
router.post("/login", authController.login);

// Gửi yêu cầu quên mật khẩu
router.post("/forgotpass", authController.forgorPassword);

// Đặt lại mật khẩu mới
router.post("/resetpass", authController.resetPassword)

// Đăng nhập bằng Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Xử lý callback đăng nhập Google
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    authController.googleCallback
);

module.exports = router;