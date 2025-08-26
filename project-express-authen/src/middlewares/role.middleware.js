const response = require("../utils/response"); 

/**
 * Middleware kiểm tra quyền truy cập theo role.
 * Truyền vào mảng role, chỉ cho phép user có role phù hợp truy cập route.
 */
module.exports = function(roles = []) {
  // Nếu truyền vào role dạng string thì chuyển thành mảng
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    // Kiểm tra role của user có nằm trong danh sách roles không
    if (!roles.includes(req.user.Role)) {
      return response.error(res, "Forbidden: You don’t have permission.", 403);
    }
    next();
  };
};