const userService = require("../services/user.service");
const response = require("../utils/response");

class UserController {
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return response.success(res, users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            if(!user) return response.notFound(res, 'User not found');
            return response.success(res, user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const userUpdated = await userService.updateUser(req.params.id, req.body)
            if(!userUpdated) return response.notFound(res, 'User not found');
            return response.success(res, userUpdated);
        } catch (error) {
            next(error);
        }
    }

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