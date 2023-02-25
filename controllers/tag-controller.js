const tegService = require('../service/tag-service')

class TagController {
    async getTags(req, res, next) {
        try {
            const tags = await tegService.getTags()
            return res.json([...tags])
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TagController()