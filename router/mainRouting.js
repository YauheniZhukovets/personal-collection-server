const Router = require('express')
const mainController = require('../controllers/main-controller')
const router = new Router()


router.get('/', mainController.getCollectionsAndItems)

module.exports = router