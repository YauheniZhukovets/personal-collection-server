const Router = require('express').Router
const router = new Router()
const authRouter = require('./authRouting')
const tagRouter = require('./tagRouting')
const commentRouter = require('./commentRouting')
const likeRouter = require('./likeRouting')
const collectionRouter = require('./collectinRouting')
const itemRouter = require('./itemRouting')
const userRouter = require('./userRouting')
const roleMiddleware = require('../middlewares/role-middleware');

router.use('/auth', authRouter)
router.use('/user', roleMiddleware, userRouter)
router.use('/tags', tagRouter)
router.use('/comment', commentRouter)
router.use('/like', likeRouter)
router.use('/collection', collectionRouter)
router.use('/item', itemRouter)


module.exports = router