const ApiError = require('../exceptions/api-error')
const CollectionModel = require('../models/collection-model')
const ItemModel = require('../models/item-model')


class MainService {
    async getCollectionsAndItems() {
        const items = await ItemModel.find({}).sort({created: -1}).limit(10).populate(['user','collectionName'])
        const collections = await CollectionModel.find({}).sort({itemsCount: -1}).limit(10).populate('user')
        if(!items || !collections){
            throw ApiError.BadRequest('Айтемы или коллекции не найдены')
        }
        return {collections, items}
    }
}

module.exports = new MainService()
