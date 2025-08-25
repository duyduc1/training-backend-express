const jwt = require("jsonwebtoken");
const response = require("../utils/response");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return response.error(res, "Access denied. No token provided.", 401);
    };

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return response.error(res, "Invalid token", 403);
        req.user = decoded; 
        next();
    });
}