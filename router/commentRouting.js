const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const commentController = require('../controllers/comment-controller')
const router = new Router()


router.get('/:itemId', commentController.getComments)
router.post('/:itemId', authMiddleware, commentController.createComments)
router.put('/:itemId/:commentId', authMiddleware, commentController.updateComments)
router.delete('/:itemId/:commentId', authMiddleware, commentController.deleteComments)

module.exports = router