const Router = require('express')
const tagController = require('../controllers/tag-controller')
const router = new Router()


router.get('/', tagController.getTags)
router.post('/', tagController.createTag)
router.delete('/:id', tagController.deleteTag)

module.exports = router