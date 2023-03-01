const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')
const axios = require('axios');
const qs = require('qs');
const ApiError = require('../exceptions/api-error');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken, refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userDate = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userDate
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userDate = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userDate
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData
    }

    async getGoogleOauthToken({code}) {
        const rootURl = 'https://oauth2.googleapis.com/token';

        const options = {
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.CLIENT_GOOGLE_REDIRECT,
            grant_type: 'authorization_code',
        }
        try {
            const {data} = await axios.post(
                rootURl,
                qs.stringify(options),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            return data
        } catch (e) {
            throw ApiError.BadRequest('Failed to fetch Google Oauth Tokens')
        }
    }

    async getGoogleUser({id_token, access_token}) {
        try {
            const {data} = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${id_token}`
                    }
                }
            )
            return data
        } catch (err) {
            throw ApiError.BadRequest('Failed to fetch User')
        }
    }

    async getGithubOathToken({code}) {
        const rootUrl = 'https://github.com/login/oauth/access_token';
        const options = {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
        }
        const queryString = qs.stringify(options);

        try {
            const {data} = await axios.post(`${rootUrl}?${queryString}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })

            const decoded = qs.parse(data)

            return decoded
        } catch (e) {
            throw ApiError.BadRequest('Failed to fetch GitHub Oauth Tokens')
        }
    }

    async getGithubUser({access_token}) {
        try {
            const {data} = await axios.get(
                'https://api.github.com/user',
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            )
            return data
        } catch (err) {
            throw ApiError.BadRequest('Failed to fetch User')
        }
    }
}

module.exports = new TokenService()