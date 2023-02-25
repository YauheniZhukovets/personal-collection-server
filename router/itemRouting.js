const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const itemController = require('../controllers/item-controller')
const router = new Router()


router.get('/', itemController.getItems)
router.get('/id', itemController.getItem)
router.post('/', authMiddleware, itemController.createItem)
router.put('/', authMiddleware, itemController.updateItem)
router.delete('/', authMiddleware, itemController.deleteItem)

module.exports = router