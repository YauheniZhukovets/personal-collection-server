const {Schema, model} = require('mongoose')

const TagSchema = new Schema({
        title: {type: String, unique: true},
    }
)

module.exports = model('Tag', TagSchema)

