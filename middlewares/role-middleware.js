const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')

module.exports = function (req, res, next) {
    try {
        const accessToken = req.headers.authorization.split(' ')[1]
        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData.isAdmin) {
            return next(ApiError.BadRequest('Доступ ограничен'))
        }
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}