const UserModel = require('../models/user-model')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const bcrypt = require('bcrypt')
const ApiError = require('../exceptions/api-error')


class AuthService {
    async registration(email, password, name) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('Пользоватеь с этим email уже сущесвует')
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({
            email,
            password: hashPassword,
            name
        })
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto._id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user || user.isBlocked) {
            throw ApiError.BadRequest('Пользователь не найден или нет доступа')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пороль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto._id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData._id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto._id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async success(user) {
        if (!user) {
            throw ApiError.BadRequest('Пользоватеь не найден(google)')
        }
        const hashPassword = await bcrypt.hash(user.emails[0].value.slice(0, 6), 3)
        await UserModel.findOrCreate({email: user.emails[0].value},{
            email: user.emails[0].value,
            password: hashPassword,
            name: user.name.givenName
        })
        const getUser = await UserModel.findOne({email: user.emails[0].value})
        const userDto = new UserDto(getUser)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto._id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
}


module.exports = new AuthService()