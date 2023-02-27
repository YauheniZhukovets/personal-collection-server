const ApiError = require('../exceptions/api-error')
const ItemModel = require('../models/item-model');
const CollectionModel = require('../models/collection-model');
const UserModel = require('../models/user-model');
const CommentModel = require('../models/comment-model')
const TagModel = require('../models/tag-model')
const LikeModel = require('../models/like-model')

class ItemService {
    async getItems(collectionId, search, tags) {
        if (!collectionId && !search && !tags) {
            throw ApiError.BadRequest('Не указаны данные для поиска')
        }
        const ownCollection = await CollectionModel.findById(collectionId).exec()

        if (collectionId && !ownCollection) {
            throw ApiError.BadRequest('Колекция не найдена')
        }

        if (search) {
            const reg = new RegExp(search, 'gi')
            const itemsFromItem = await ItemModel.find(
                {$or: [{title: reg}, {tags: reg}, {string1: reg}, {string2: reg}, {string3: reg}, {text1: reg}, {text2: reg}, {text3: reg}]}
            )
            const itemsFromItemId = itemsFromItem.map(el => `${el._id}`)
            const comments = await CommentModel.find({text: reg})
            const commentsItemsId = comments.map(c => `${c.item}`)
            const commonId = [...new Set([...itemsFromItemId, ...commentsItemsId])]

            const commonItems = []
            for (const id of commonId) {
                const item = await ItemModel.findById(id)
                commonItems.push(item)
            }
            return commonItems
        }

        if (tags) {
            return ItemModel.find({tags: {$all: tags}})
        }

        return ItemModel.find({collectionName: ownCollection}).populate(['user', 'collectionName'])
    }

    async getItem(collectionId, itemId) {
        if (!collectionId || !itemId) {
            throw ApiError.BadRequest('Не указаны данные для поиска')
        }
        return ItemModel.findById(itemId).populate(['user', 'collectionName'])
    }

    async createItem(itemDate, userAuthorize) {
        if (!itemDate || !userAuthorize) {
            throw ApiError.BadRequest('Недостатточно данных для создания айтема')
        }

        const ownCollection = await CollectionModel.findById(itemDate.collectionId).exec()

        let userId
        if (!itemDate.userId) {
            userId = userAuthorize._id
        }
        if (itemDate.userId === userAuthorize._id || userAuthorize.isAdmin) {
            userId = itemDate.userId
        }

        const user = await UserModel.findOne({_id: userId})

        const collectionName = ownCollection._id
        const title = itemDate.title || 'No name'
        const tags = itemDate.tags || []
        const string1 = itemDate.string1 || null
        const string2 = itemDate.string2 || null
        const string3 = itemDate.string3 || null
        const text1 = itemDate.text1 || null
        const text2 = itemDate.text2 || null
        const text3 = itemDate.text3 || null
        const number1 = itemDate.number1 || null
        const number2 = itemDate.number2 || null
        const number3 = itemDate.number3 || null
        const boolean1 = itemDate.boolean1
        const boolean2 = itemDate.boolean2
        const boolean3 = itemDate.boolean3
        const date1 = itemDate.date1 || null
        const date2 = itemDate.date2 || null
        const date3 = itemDate.date3 || null

        if (tags.length) {
            const oldTags = await TagModel.find({})
            const oldTitleTags = oldTags.map(t => t.title)
            const newTags = tags.filter(t => !oldTitleTags.includes(t)).map(t => {
                return {title: t}
            })

            if (newTags.length) {
                await TagModel.insertMany(newTags)
            }
        }

        const foundTags = await TagModel.find({'title': {$in: tags}})
        if (!foundTags) {
            throw ApiError.BadRequest('Тэги не найдены')
        }
        const tagsFromDb = foundTags.length ? foundTags.map(t => t.title) : []

        if (userId) {
            await ItemModel.create({
                user,
                collectionName,
                title,
                tags: tagsFromDb,
                string1,
                string2,
                string3,
                text1,
                text2,
                text3,
                number1,
                number2,
                number3,
                boolean1,
                boolean2,
                boolean3,
                date1,
                date2,
                date3,
                created: new Date(),
                updated: new Date()
            })
        }
        await ItemModel.count({collectionName: ownCollection._id})
            .exec()
            .then((itemCount) => {
                CollectionModel.findByIdAndUpdate(ownCollection._id, {itemsCount: itemCount}, {new: true}).exec()
            })
        return ItemModel.find({collectionName: ownCollection._id}).populate(['user', 'collectionName'])
    }

    async updateItem(itemDate, userAuthorize) {
        if (!itemDate || !userAuthorize) {
            throw ApiError.BadRequest('Недостатточно данных для изменения айтема')
        }
        const ownCollection = await CollectionModel.findById(itemDate.collectionId).exec()
        let userId
        if (itemDate.userId === userAuthorize._id || userAuthorize.isAdmin) {
            userId = itemDate.userId
        }
        if (!itemDate.userId) {
            userId = userAuthorize._id
        }

        const titleReq = itemDate.title || undefined
        const tagsReq = itemDate.tags || undefined
        const string1Req = itemDate.string1 || undefined
        const string2Req = itemDate.string2 || undefined
        const string3Req = itemDate.string3 || undefined
        const text1Req = itemDate.text1 || undefined
        const text2Req = itemDate.text2 || undefined
        const text3Req = itemDate.text3 || undefined
        const number1Req = itemDate.number1 || undefined
        const number2Req = itemDate.number2 || undefined
        const number3Req = itemDate.number3 || undefined
        const boolean1Req = itemDate.boolean1 || undefined
        const boolean2Req = itemDate.boolean2 || undefined
        const boolean3Req = itemDate.boolean3 || undefined
        const date1Req = itemDate.date1 || undefined
        const date2Req = itemDate.date2 || undefined
        const date3Req = itemDate.date3 || undefined


        const oldItem = await ItemModel.findById(itemDate.itemId).exec()
        if (!oldItem) {
            throw ApiError.BadRequest('Айтем не найдена')
        }

        if (tagsReq.length) {
            const oldTags = await TagModel.find({})
            const oldTitleTags = oldTags.map(t => t.title)
            const newTags = tagsReq.filter(t => !oldTitleTags.includes(t)).map(t => {
                return {title: t}
            })

            if (newTags.length) {
                await TagModel.insertMany(newTags)
            }
        }

        const foundTags = await TagModel.find({'title': {$in: tagsReq}})
        if (!foundTags) {
            throw ApiError.BadRequest('Тэги не найдены')
        }
        const tagsFromDb = foundTags.length ? foundTags.map(t => t.title) : []

        if (userId) {
            await ItemModel.findByIdAndUpdate(
                itemDate.itemId,
                {
                    title: titleReq || oldItem.title,
                    tags: tagsFromDb || oldItem.tags,
                    string1: string1Req || itemDate.string1,
                    string2: string2Req || itemDate.string2,
                    string3: string3Req || itemDate.string3,
                    text1: text1Req || itemDate.text1,
                    text2: text2Req || itemDate.text2,
                    text3: text3Req || itemDate.text3,
                    number1: number1Req || itemDate.number1,
                    number2: number2Req || itemDate.number2,
                    number3: number3Req || itemDate.number3,
                    boolean1: boolean1Req || itemDate.boolean1,
                    boolean2: boolean2Req || itemDate.boolean2,
                    boolean3: boolean3Req || itemDate.boolean3,
                    date1: date1Req || itemDate.date1,
                    date2: date2Req || itemDate.date2,
                    date3: date3Req || itemDate.date3,
                }
            )
        }
        return ItemModel.find({collectionName: ownCollection._id}).populate(['user', 'collectionName'])
    }

    async deleteItem(userId, collectionId, itemId, userAuthorize) {
        if (!collectionId || !itemId || !userAuthorize) {
            throw ApiError.BadRequest('Недостаточно данных для удаления айтема')
        }
        let user_id
        if (!userId) {
            user_id = userAuthorize._id
        }
        if (userId === userAuthorize._id || userAuthorize.isAdmin) {
            user_id = userId
        }
        if (user_id) {
            await ItemModel.findByIdAndDelete(itemId)
            await CommentModel.deleteMany({item: itemId})
            await LikeModel.deleteMany({item: itemId})
        }
        await ItemModel.count({collectionName: collectionId})
            .exec()
            .then((itemCount) => {
                CollectionModel.findByIdAndUpdate(collectionId, {itemsCount: itemCount}, {new: true}).exec()
            })
        return ItemModel.find({collectionName: collectionId}).populate(['user', 'collectionName'])
    }
}

module.exports = new ItemService()