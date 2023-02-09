const tegService = require('../service/tag-service')

class TagController {
    async getTags(req, res, next) {
        try {
            const tags = await tegService.getTags()
            return res.json({tags})
        } catch (e) {
            next(e)
        }
    }

    async createTag(req, res, next) {
        try {
            const newTags = req.body
            const tags = await tegService.createTag(newTags)
            return res.json({tags})
        } catch (e) {
            next(e)
        }
    }

    async deleteTag(req, res, next) {
        try {
            const {id} = req.params
            const tags = await tegService.deleteTag(id)
            return res.json({tags})
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TagController()