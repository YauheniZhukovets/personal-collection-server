const configCookie = {
    MONTH: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
        httpOnly: false
    }

}

module.exports = {
    configCookie
}