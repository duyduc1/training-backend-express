const jwt = require("jsonwebtoken");
const response = require("../utils/response");

/**
 * Middleware xác thực JWT cho các route cần bảo vệ.
 * Kiểm tra token trong header, xác thực và gán thông tin user vào req.
 */
module.exports = (req, res, next) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Nếu không có token thì trả về lỗi
    if (!token) {
        return response.error(res, "Access denied. No token provided.", 401);
    };

    // Xác thực token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return response.error(res, "Invalid token", 403);
        req.user = decoded; // Gán thông tin user vào req
        next();
    });
}