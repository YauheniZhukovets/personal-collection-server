const Router = require('express')
const {body} = require('express-validator')
const authController = require('../controllers/auth-controller')
const router = new Router()
const passport = require('passport')


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 1, max: 32}),
    authController.registration
)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/refresh', authController.refresh)

router.get('/login/failed', authController.error)
router.get('/login/success', authController.success)
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL + '/google',
    failureRedirect: '/login/failed'
}))
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

module.exports = router