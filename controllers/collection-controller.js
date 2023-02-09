const collectionService = require('../service/collection-service')

class CollectionController {
    async getCollections(req, res, next) {
        try {
            const {userId} = req.query
            const collections = await collectionService.getCollections(userId)
            return res.json({collections})
        } catch (e) {
            next(e)
        }
    }

    async createCollection(req, res, next) {
        const collectionDate = req.body
        const userAuthorize = req.user
        try {
            const collections = await collectionService.createCollection(collectionDate, userAuthorize)
            return res.json({collections})
        } catch (e) {
            next(e)
        }
    }

    async updateCollection(req, res, next) {
        const collectionDate = req.body
        const userAuthorize = req.user
        try {
            const collections = await collectionService.updateCollection(collectionDate, userAuthorize)
            return res.json({collections})
        } catch (e) {
            next(e)
        }
    }

    async deleteCollection(req, res, next) {
        try {
            const {userId, collectionId} = req.query
            const userAuthorize = req.user
            const collections = await collectionService.deleteCollection(userId, collectionId, userAuthorize)
            return res.json({collections})
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CollectionController()