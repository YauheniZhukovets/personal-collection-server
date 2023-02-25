const TagModel = require('../models/tag-model')

class TagService {
    getTags() {
        return TagModel.find({})
    }
}

module.exports = new TagService()
