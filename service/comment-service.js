const CommentModel = require('../models/comment-model')
const ItemModel = require('../models/item-model')
const ApiError = require('../exceptions/api-error')
const UserModel = require('../models/user-model');

class CommentService {
    async getComments(itemId) {
        if (!itemId) {
            throw ApiError.BadRequest('Айтем не найден')
        }
        const comments = await CommentModel.find({item: itemId}).populate('user')
        if (!comments) {
            throw ApiError.BadRequest('Коментарии не найдены')
        }
        return comments
    }

    async createComments(userId, itemId, text) {
        if (!itemId) {
            throw ApiError.BadRequest('Айтем не найден')
        }
        const item = await ItemModel.findOne({_id: itemId})
        if (!item) {
            throw ApiError.BadRequest('айтем не найден')
        }
        const user = await UserModel.findOne({_id: userId})
        if(!user) {
            throw ApiError.BadRequest('Пользователь не найден в БД')
        }
        if (!text) {
            throw ApiError.BadRequest('Текст коментария отсутсвует')
        }
        await CommentModel.create({item, user, text})
        await ItemModel.findOneAndUpdate(itemId, {countComments: ++item.countComments})
        const comments = await CommentModel.find({item: itemId}).populate('user')
        if (!comments) {
            throw ApiError.BadRequest('Коментарии не найдены')
        }
        return comments
    }

    async updateComments(userId, itemId, commentId, text) {
        if (!itemId || !commentId || !userId ) {
            throw ApiError.BadRequest('Айтем или коммент или пользователь не указаны')
        }
        const user = await UserModel.findOne({_id: userId})
        if(!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const item = await ItemModel.findOne({_id: itemId})
        if (!item) {
            throw ApiError.BadRequest('Айтем не найден')
        }
        if (!text) {
            throw ApiError.BadRequest('Текст коментария отсутсвует')
        }
        const comment = await CommentModel.findOne({_id: commentId})
        if(comment.user === user._id || user.isAdmin) {
            await CommentModel.findOneAndUpdate({_id: commentId}, {text: text})
        } else {
            throw ApiError.BadRequest('Вы не можете изменить коментарий')
        }
        const comments = await CommentModel.find({item: itemId}).populate('user')
        if (!comments) {
            throw ApiError.BadRequest('Коментарии не найдены')
        }
        return comments
    }

    async deleteComments(userId, itemId, commentId) {
        if (!itemId || !commentId || !userId ) {
            throw ApiError.BadRequest('Айтем или коментарий или пользователь не указаны')
        }
        const item = await ItemModel.findOne({_id: itemId})
        if (!item) {
            throw ApiError.BadRequest('Айтем не найден')
        }
        const user = await UserModel.findOne({_id: userId})
        if(!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const comment = await CommentModel.findOne({_id: commentId})
        if(comment.user === user._id || user.isAdmin) {
            await CommentModel.findOneAndDelete({_id: commentId})
            await ItemModel.findOneAndUpdate({_id: itemId}, {countComments: --item.countComments})
        } else {
            throw ApiError.BadRequest('Вы не можете удалить коментарий')
        }
        const comments = await CommentModel.find({item: itemId}).populate('user')
        if (!comments) {
            throw ApiError.BadRequest('Коментарии не найдены')
        }
        return comments
    }
}

module.exports = new CommentService()
