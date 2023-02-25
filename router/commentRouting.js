const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const commentController = require('../controllers/comment-controller')
const router = new Router()


router.get('/', commentController.getComments)
router.post('/', authMiddleware, commentController.createComments)
router.put('/', authMiddleware, commentController.updateComments)
router.delete('/', authMiddleware, commentController.deleteComments)

module.exports = router