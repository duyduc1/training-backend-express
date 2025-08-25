const userService = require("../services/user.service");
const response = require("../utils/response");

class UserController {
    /**
     * Lấy danh sách tất cả người dùng.
     */
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return response.success(res, users);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy thông tin người dùng theo id.
     * Kiểm tra id, trả về thông tin nếu tồn tại.
     */
    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            if(!user) return response.notFound(res, 'User not found');
            return response.success(res, user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật thông tin người dùng theo id.
     * Nhận dữ liệu mới từ body, cập nhật vào database.
     */
    async updateUser(req, res, next) {
        try {
            const userUpdated = await userService.updateUser(req.params.id, req.body)
            if(!userUpdated) return response.notFound(res, 'User not found');
            return response.success(res, userUpdated);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xóa người dùng theo id.
     * Kiểm tra id, xóa nếu tồn tại.
     */
    async deleteUserById(req, res, next) {
        try {
            const userDeleted = await userService.deleteUserById(req.params.id);
            if(!userDeleted) return response.notFound(res, 'User not found');
            return response.success(res, { message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();