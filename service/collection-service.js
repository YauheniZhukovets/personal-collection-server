const ApiError = require('../exceptions/api-error')
const CollectionModel = require('../models/collection-model')
const UserModel = require('../models/user-model')

class CollectionService {
    async getCollections(userId) {
        if (!userId) {
            throw ApiError.BadRequest('Не указан id пользователя коллекции')
        }
        return CollectionModel.find({user: userId}).populate('user')
    }

    async createCollection(collectionDate, userAuthorize, id) {
        if (!collectionDate || !userAuthorize) {
            throw ApiError.BadRequest('Нет данных для создания коллекции')
        }
        let userId
        if (id === userAuthorize._id || userAuthorize.isAdmin) {
            userId = id
        }
        if (!id) {
            userId = userAuthorize._id
        }
        const user = await UserModel.findOne({_id: userId})
        const name = collectionDate.name || 'No name'
        const theme = collectionDate.theme || 'No theme'
        const description = collectionDate.description || ''
        const image = collectionDate.image || null
        const fields = collectionDate.fields || []

        if (userId) {
            await CollectionModel.create({
                user, name, theme, description, image, fields, created: new Date(), updated: new Date()
            })
        }
        await CollectionModel.count({user})
            .exec()
            .then((collectionCount) => {
                UserModel.findByIdAndUpdate(user._id, {collectionsCount: collectionCount}, {new: true}).exec()
            })
        return CollectionModel.find({user}).populate('user')
    }

    async updateCollection(collectionDate, userAuthorize, id) {
        if (!collectionDate || !userAuthorize) {
            throw ApiError.BadRequest('Нет данных для обнавления коллекции')
        }
        const nameReq = collectionDate.name || undefined
        const themeReq = collectionDate.theme || undefined
        const descriptionReq = collectionDate.description || undefined
        const fieldsReq = collectionDate.fields || undefined
        const imageReq = collectionDate.image

        let userId
        if (!id) {
            userId = userAuthorize._id
        }
        if (id === userAuthorize._id || userAuthorize.isAdmin) {
            userId = id
        }
        const user = await UserModel.findOne({_id: userId})
        const oldCollection = await CollectionModel.findById(collectionDate._id).exec()
        if (!oldCollection) {
            throw ApiError.BadRequest('Коллекция не найдена')
        }
        if (userId) {
            await CollectionModel.findByIdAndUpdate(
                collectionDate._id,
                {
                    name: nameReq || oldCollection.name,
                    theme: themeReq || oldCollection.theme,
                    description: descriptionReq || oldCollection.description,
                    image: imageReq === null ? null : imageReq ? imageReq : oldCollection.image,
                    fields: fieldsReq || oldCollection.fields
                }
            )
        }
        return CollectionModel.find({user}).populate('user')
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
        return CollectionModel.find({user}).populate('user')
    }
}

module.exports = new CollectionService()
