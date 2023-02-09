const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const userController = require('../controllers/user-controller')
const router = new Router()


router.get('/', authMiddleware, userController.getUsers)
router.post('/block', authMiddleware, userController.blockUser)
router.post('/unblock', authMiddleware, userController.unblockUser)
router.post('/delete', authMiddleware, userController.deleteUser)

module.exports = router