const ApiError = require('../exceptions/api-error')
const CollectionModel = require('../models/collection-model')
const UserModel = require('../models/user-model')

class CollectionService {
    async getCollections(userId) {
        if (!userId) {
            throw ApiError.BadRequest('Не указан id пользователя коллекции')
        }
        return CollectionModel.find({user: userId});
    }

    async createCollection(collectionDate, userAuthorize) {
        if (!collectionDate || !userAuthorize) {
            throw ApiError.BadRequest('Нет данных для создания коллекции')
        }
        let userId
        if (collectionDate.userId === userAuthorize._id || userAuthorize.isAdmin) {
            userId = collectionDate.userId
        }
        if (!collectionDate.userId) {
            userId = userAuthorize._id
        }
        const user = await UserModel.findOne({_id: userId})
        const name = collectionDate.name || 'No name'
        const theme = collectionDate.theme || 'No theme'
        const description = collectionDate.description || ''
        const image = collectionDate.image || ''
        if(userId) {
            await CollectionModel.create({
                user, name, theme, description, image, created: new Date(), updated: new Date()
            })
        }
        await CollectionModel.count({user})
            .exec()
            .then((collectionCount) => {
                UserModel.findByIdAndUpdate(user._id, {collectionsCount: collectionCount}, {new: true}).exec()
            })
        return CollectionModel.find({user})
    }

    async updateCollection(collectionDate, userAuthorize) {
        if (!collectionDate || !userAuthorize) {
            throw ApiError.BadRequest('Нет данных для обнавления коллекции')
        }
        const nameReq = collectionDate.name || undefined
        const themeReq = collectionDate.theme || undefined
        const descriptionReq = collectionDate.description || undefined
        const imageReq = collectionDate.image || undefined
        let userId
        if (!collectionDate.userId) {
            userId = userAuthorize._id
        }
        if (collectionDate.userId === userAuthorize._id || userAuthorize.isAdmin) {
            userId = collectionDate.userId
        }
        const user = await UserModel.findOne({_id: userId})
        const oldCollection = await CollectionModel.findById(collectionDate._id).exec()
        if (!oldCollection) {
            throw ApiError.BadRequest('Коллекция не найдена')
        }
        if(userId) {
            await CollectionModel.findByIdAndUpdate(
                collectionDate._id,
                {
                    name: nameReq || oldCollection.name,
                    theme: themeReq || oldCollection.theme,
                    description: descriptionReq || oldCollection.description,
                    image: imageReq || oldCollection.image
                }
            )
        }
        return CollectionModel.find({user})
    }

    async deleteCollection(userId, collectionId, userAuthorize) {
        if (!collectionId || !userAuthorize) {
            throw ApiError.BadRequest('Нет данных для удаления коллекции')
        }
        let user_id
        if (!userId) {
            user_id = userAuthorize._id
        }
        if (userId === userAuthorize._id || userAuthorize.isAdmin) {
            user_id = userId
        }
        const user = await UserModel.findOne({_id: user_id})
        if (userId) {
            const collection = await CollectionModel.findByIdAndDelete(collectionId)
            if (!collection) {
                throw ApiError.BadRequest('Коллекция не найдена')
            }
        }
        await CollectionModel.count({user})
            .exec()
            .then((collectionCount) => {
                UserModel.findByIdAndUpdate(user._id, {collectionsCount: collectionCount}, {new: true}).exec()
            })
        return CollectionModel.find({user})
    }
}

module.exports = new CollectionService()