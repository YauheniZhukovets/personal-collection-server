const likeService = require('../service/like-service')

class LikeController {
    async addLike(req, res, next) {
        try {
            const {itemId} = req.query
            const userId = req.user._id
            const likes = await likeService.addLike(itemId, userId)
            return res.json([...likes])
        } catch (e) {
            next(e)
        }
    }

    async deleteLike(req, res, next) {
        try {
            const {itemId} = req.query
            const userId = req.user._id
            const likes = await likeService.deleteLike(itemId, userId)
            return res.json([...likes])
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new LikeController()