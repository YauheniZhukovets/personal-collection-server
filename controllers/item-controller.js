const itemService = require('../service/item-service')

class ItemController {
    async getItems(req, res, next) {
        try {
            const {collectionId, search, tags} = req.query
            const items = await itemService.getItems(collectionId, search, tags)
            return res.json([...items])
        } catch (e) {
            next(e)
        }
    }

    async getItem(req, res, next) {
        try {
            const {collectionId, itemId} = req.query
            const item = await itemService.getItem(collectionId,itemId)
            return res.json(item)
        } catch (e) {
            next(e)
        }
    }

    async createItem(req, res, next) {
        const itemDate = req.body
        const userAuthorize = req.user
        try {
            const items = await itemService.createItem(itemDate, userAuthorize)
            return res.json([...items])
        } catch (e) {
            next(e)
        }
    }

    async updateItem(req, res, next) {
        const itemDate = req.body
        const userAuthorize = req.user
        try {
            const items = await itemService.updateItem(itemDate, userAuthorize)
            return res.json([...items])
        } catch (e) {
            next(e)
        }
    }

    async deleteItem(req, res, next) {
        const {userId, collectionId, itemId} = req.query
        const userAuthorize = req.user
        try {
            const items = await itemService.deleteItem(userId, collectionId, itemId, userAuthorize)
            return res.json([...items])
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ItemController()