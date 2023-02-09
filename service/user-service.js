const UserModel = require('../models/user-model')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')


class UserService {
    async getAllUsers() {
        const users = await UserModel.find()
        return users.map(u => new UserDto(u))
    }

    async blockUser(ids) {
        if (ids.length === 0) {
            throw ApiError.BadRequest('Нет id')
        }
        await UserModel.updateMany({_id: {$in: ids}}, {$set: {isBlocked: true}}, {multi: true})
        const allUsers = await UserModel.find()
        return allUsers.map(u => new UserDto(u))
    }

    async unblockUser(ids) {
        if (ids.length === 0) {
            throw ApiError.BadRequest('Нет id')
        }
        await UserModel.updateMany({_id: {$in: ids}}, {$set: {isBlocked: false}}, {multi: true})
        const allUsers = await UserModel.find()
        return allUsers.map(u => new UserDto(u))
    }

    async deleteUser(ids) {
        if (ids.length === 0) {
            throw ApiError.BadRequest('Нет id')
        }
        await UserModel.deleteMany({_id: {$in: ids}}, {multi: true})
        const allUsers = await UserModel.find()
        return allUsers.map(u => new UserDto(u))
    }
}

module.exports = new UserService()