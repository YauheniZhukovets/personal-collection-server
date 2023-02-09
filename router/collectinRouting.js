const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const collectionController = require('../controllers/collection-controller')
const router = new Router()


router.get('/', collectionController.getCollections)
router.post('/', authMiddleware, collectionController.createCollection)
router.put('/', authMiddleware, collectionController.updateCollection)
router.delete('/', authMiddleware, collectionController.deleteCollection)

module.exports = router