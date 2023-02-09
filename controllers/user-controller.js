const userService = require('../service/user-service')


class UserController {
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async blockUser(req, res, next) {
        try {
            const {ids} = req.body
            const users = await userService.blockUser(ids)
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async unblockUser(req, res, next) {
        try {
            const {ids} = req.body
            const users = await userService.unblockUser(ids)
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {ids} = req.body
            const users = await userService.deleteUser(ids)
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()