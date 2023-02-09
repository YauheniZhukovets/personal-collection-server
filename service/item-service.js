const ApiError = require('../exceptions/api-error')
const ItemModel = require('../models/item-model');
const CollectionModel = require('../models/collection-model');
const UserModel = require('../models/user-model');

class ItemService {
    async getItems(collectionId, sortItem) {
        if (!collectionId) {
            throw ApiError.BadRequest('Не указаны данные для поиска')
        }
        const sort = sortItem || ''
        const sortName = (sort && sort.length > 2) ? sort.slice(1) : ''
        const sortDirection = sortName ? (sort[0] === '0' ? -1 : 1) : undefined
        const sorting = sortName ? {[sortName]: sortDirection} : {update: -1}
        const ownCollection = await CollectionModel.findById(collectionId).exec()
        if (!ownCollection) {
            throw ApiError.BadRequest('Колекция не найдена')
        }
        return ItemModel.find({ownCollection}).sort(sorting);
    }

    async createItem(itemDate, userAuthorize) {
        if (!itemDate || !userAuthorize) {
            throw ApiError.BadRequest('Недостатточно данных для создания айтема')
        }
        const ownCollection = await CollectionModel.findById(itemDate.collectionId).exec()
        let userId
        if (!ownCollection.user) {
            userId = userAuthorize._id
        }
        if (ownCollection.user === userAuthorize._id || userAuthorize.isAdmin) {
            userId = ownCollection.user
        }
        const user = await UserModel.findOne({_id: userId})
        const collectionName = ownCollection._id
        const title = itemDate.title || 'No name'
        if (userId) {
            await ItemModel.create({
                user, collectionName, title, created: new Date(), updated: new Date()
            })
        }
        await ItemModel.count({collectionName: ownCollection._id})
            .exec()
            .then((itemCount) => {
                CollectionModel.findByIdAndUpdate(ownCollection._id, {itemsCount: itemCount}, {new: true}).exec()
            })
        return ItemModel.find({ownCollection})
    }

    async updateItem(itemDate, userAuthorize) {
        if (!itemDate || !userAuthorize) {
            throw ApiError.BadRequest('Недостатточно данных для изменения айтема')
        }
        const ownCollection = await CollectionModel.findById(itemDate.collectionId).exec()
        let userId
        if (ownCollection.user === userAuthorize._id || userAuthorize.isAdmin) {
            userId = ownCollection.user
        }
        if (!ownCollection.user) {
            userId = userAuthorize._id
        }
        const titleReq = itemDate.title || undefined
        const oldItem = await ItemModel.findById(itemDate._id).exec()
        if (!oldItem) {
            throw ApiError.BadRequest('Айтем не найдена')
        }
        if (userId) {
            await ItemModel.findByIdAndUpdate(
                itemDate._id,
                {
                    title: titleReq || oldItem.title
                }
            )
        }
        return ItemModel.find({ownCollection})
    }

    async deleteItem(userId, collectionId, itemId, userAuthorize) {
        if (!collectionId || itemId || !userAuthorize) {
            throw ApiError.BadRequest('Недостатточно данных для удаления айтема')
        }
        let user_id
        if (!userId) {
            user_id = userAuthorize._id
        }
        if (userId === userAuthorize._id || userAuthorize.isAdmin) {
            user_id = userId
        }
        if (user_id) {
            const item = await ItemModel.findByIdAndDelete(itemId)
            if (!item) {
                throw ApiError.BadRequest('Итем не найден')
            }
        }
        await ItemModel.count({collectionName: collectionId})
            .exec()
            .then((itemCount) => {
                CollectionModel.findByIdAndUpdate(collectionId, {itemsCount: itemCount}, {new: true}).exec()
            })
        return ItemModel.find({collectionName: collectionId})
    }
}

module.exports = new ItemService()
