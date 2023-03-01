const userService = require('../service/auth-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const {configCookie} = require('../helpers/cookieConfig')

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }
            const {email, password, name} = req.body
            const userData = await userService.registration(email, password, name)
            res.cookie('refreshToken', userData.refreshToken, {...configCookie.MONTH})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {...configCookie.MONTH})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken', {...configCookie.MONTH})
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {...configCookie.MONTH})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async googleOauthHandler(req, res, next) {
        const code = req.query.code
        const pathUrl = req.query.state || '/'
        try {
            const userData = await userService.googleOauthHandler(code)
            res.cookie('refreshToken', userData.refreshToken, {...configCookie.MONTH})
            res.redirect(process.env.CLIENT_URL + `${pathUrl}`)
        } catch (e) {
            next(e)
            res.redirect(process.env.CLIENT_URL + `${pathUrl}`)
        }
    }

    async githubOauthHandler(req, res, next) {
        const code = req.query.code
        const pathUrl = req.query.state ?? '/'
        try {
            const userData = await userService.githubOauthHandler(code)
            res.cookie('refreshToken', userData.refreshToken, {...configCookie.MONTH})
            res.redirect(process.env.CLIENT_URL + `${pathUrl}`)
        } catch (e) {
            next(e)
            res.redirect(process.env.CLIENT_URL + `${pathUrl}`)
        }
    }
}

module.exports = new AuthController()

