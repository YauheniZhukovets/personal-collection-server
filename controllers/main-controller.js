const mainService = require('../service/main-service')

class MainController {
    async getCollectionsAndItems(req, res, next) {
        try {
            const collectionsAndItems = await mainService.getCollectionsAndItems()
            return res.json(collectionsAndItems)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new MainController()