const ApiError = require('../exceptions/api-error')
const LikeModel = require('../models/like-model')
const ItemModel = require('../models/item-model')

class LikeService {
    async addLike(itemId, userId) {
        if (!itemId || !userId) {
            throw ApiError.BadRequest('Айтем или пользователь не указаны')
        }
        const likeCheck = await LikeModel.findOne({user: userId, item: itemId})
        if (likeCheck) {
            throw ApiError.BadRequest('Можно лайкнуть один раз')
        }
        await LikeModel.create({user: userId, item: itemId})
        const likes = await LikeModel.find({item: itemId})
        await ItemModel.findOneAndUpdate({_id: itemId}, {likes: likes})
        const item = await ItemModel.findOne({_id: itemId})
        return item.likes
    }

    async deleteLike(itemId, userId) {
        if (!itemId || !userId) {
            throw ApiError.BadRequest('Айтем или пользователь не указаны')
        }
        const like = await LikeModel.findOne({user: userId, item: itemId})
        if (!like) {
            throw ApiError.BadRequest('Вы не ставили лайк')
        }
        await LikeModel.findOneAndDelete({_id: like._id})
        const likes = await LikeModel.find({item: itemId})
        await ItemModel.findOneAndUpdate({_id: itemId}, {likes: likes})
        const item = await ItemModel.findOne({_id: itemId})
        return item.likes
    }
}

module.exports = new LikeService()
