const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const userController = require('../controllers/user-controller')
const router = new Router()


router.get('/', authMiddleware, userController.getUsers)
router.post('/block', authMiddleware, userController.blockUser)
router.post('/unblock', authMiddleware, userController.unblockUser)
router.post('/remove-admin', authMiddleware, userController.removeAdmin)
router.post('/add-admin', authMiddleware, userController.addAdmin)
router.post('/delete', authMiddleware, userController.deleteUser)

module.exports = router