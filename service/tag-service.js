const TagModel = require('../models/tag-model')
const ItemModel = require('../models/item-model')

class TagService {
    async getTags() {
        const tags = await TagModel.find({})

        const finishTags = []
        for (const tag of tags) {
            await ItemModel.count({tags: {$all: tag.title}})
                .exec()
                .then((count) => finishTags.push({title: tag.title, count}))
        }
        return finishTags.filter(t => t.count > 0)
    }
}

module.exports = new TagService()
