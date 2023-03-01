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

    async googleOauthHandler(code) {
        if (!code) {
            throw ApiError.BadRequest('Authorization code not provided!')
        }
        const {id_token, access_token} = await tokenService.getGoogleOauthToken({code})
        const {name, email} = await tokenService.getGoogleUser({id_token, access_token})
        const hashPassword = await bcrypt.hash(email.slice(0, 6), 3)
        await UserModel.findOrCreate({email: email}, {
            email: email,
            password: hashPassword,
            name: name
        })
        const user = await UserModel.findOne({email: email})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto._id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async githubOauthHandler(code) {
        if (!code) {
            throw ApiError.BadRequest('Authorization github code not provided!')
        }
        const {access_token} = await tokenService.getGithubOathToken({code})
        const {login, email} = await tokenService.getGithubUser({access_token})
        const hashPassword = await bcrypt.hash(email.slice(0, 6), 3)
        await UserModel.findOrCreate({email: email}, {
            email: email,
            password: hashPassword,
            name: login
        })
        const user = await UserModel.findOne({email: email})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto._id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
}


module.exports = new AuthService()