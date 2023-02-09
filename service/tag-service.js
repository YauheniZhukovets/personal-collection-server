const TagModel = require('../models/tag-model')
const ApiError = require('../exceptions/api-error')

class TagService {
    getTags() {
        return TagModel.find()
    }

    async createTag(newTags) {
        await TagModel.insertMany(newTags, (error) => {
            if (error) {
                throw ApiError.BadRequest('Не созданно, попробуде повторить')
            }
        })
        return TagModel.find()
    }

    async deleteTag(id) {
        const tag = await TagModel.findByIdAndDelete(id)
        if (!tag) {
            throw ApiError.BadRequest('Тэг не удалён, попробуйте повтарить')
        }
        return TagModel.find()
    }
}

module.exports = new TagService()
