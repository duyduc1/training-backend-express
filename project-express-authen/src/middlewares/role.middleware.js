const response = require("../utils/response"); 

module.exports = function(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return response.error(res, "Forbidden: You don’t have permission.", 403);
    }
    next();
  };
};
