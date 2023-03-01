const Router = require('express')
const {body} = require('express-validator')
const authController = require('../controllers/auth-controller')
const router = new Router()


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 1, max: 32}),
    authController.registration
)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/refresh', authController.refresh)
router.get('/google', authController.googleOauthHandler)
router.get('/github', authController.githubOauthHandler)

module.exports = router