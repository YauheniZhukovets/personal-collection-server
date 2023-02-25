const commentService = require('../service/comment-service')

class CommentController {
    async getComments(req, res, next) {
        try {
            const {itemId} = req.query
            const comments = await commentService.getComments(itemId)
            return res.json([...comments])
        } catch (e) {
            next(e)
        }
    }

    async createComments(req, res, next) {
        try {
            const userId = req.user._id
            const {itemId} = req.query
            const {text} = req.body
            const comments = await commentService.createComments(userId, itemId, text)
            return res.json([...comments])
        } catch (e) {
            next(e)
        }
    }

    async updateComments(req, res, next) {
        try {
            const userId = req.user._id
            const {itemId, commentId} = req.query
            const {text} = req.body
            const comments = await commentService.updateComments(userId, itemId, commentId, text)
            return res.json([...comments])
        } catch (e) {
            next(e)
        }
    }

    async deleteComments(req, res, next) {
        try {
            const userId = req.user._id
            const {itemId, commentId} = req.query
            const comments = await commentService.deleteComments(userId, itemId, commentId)
            return res.json([...comments])
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CommentController()