const Router = require('express')
const tagController = require('../controllers/tag-controller')
const router = new Router()


router.get('/', tagController.getTags)

module.exports = router