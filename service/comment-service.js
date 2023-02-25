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
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        if (!text) {
            throw ApiError.BadRequest('Текст коментария отсутсвует')
        }
        await CommentModel.create({item, user, text})
        await CommentModel.count({item:itemId})
            .exec()
            .then((countComments) => {
                ItemModel.findByIdAndUpdate({_id: itemId}, {countComments: countComments}, {new: true}).exec()
            })
        const comments = await CommentModel.find({item: itemId}).populate('user')
        if (!comments) {
            throw ApiError.BadRequest('Коментарии не найдены')
        }
        return comments
    }

    async updateComments(userId, itemId, commentId, text) {
        if (!itemId || !commentId || !userId) {
            throw ApiError.BadRequest('Айтем или коммент или пользователь не указаны')
        }
        const user = await UserModel.findOne({_id: userId})
        if (!user) {
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
        if (comment.user.toString() === user._id.toString() || user.isAdmin) {
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
        if (!itemId || !commentId || !userId) {
            throw ApiError.BadRequest('Айтем или коментарий или пользователь не указаны')
        }
        const item = await ItemModel.findOne({_id: itemId})
        if (!item) {
            throw ApiError.BadRequest('Айтем не найден')
        }
        const user = await UserModel.findOne({_id: userId})
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const comment = await CommentModel.findOne({_id: commentId})
        if (comment.user.toString() === user._id.toString() || user.isAdmin) {
            await CommentModel.findOneAndDelete({_id: commentId})
            await CommentModel.count({item})
                .exec()
                .then((countComments) => {
                    ItemModel.findByIdAndUpdate({_id: itemId}, {countComments: countComments}, {new: true}).exec()
                })
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
