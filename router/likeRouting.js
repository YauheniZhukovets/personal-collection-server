const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const likeController = require('../controllers/like-controller')
const router = new Router()


router.post('/', authMiddleware, likeController.addLike)
router.delete('/:itemId', authMiddleware, likeController.deleteLike)

module.exports = router