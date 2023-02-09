const {Schema, model} = require('mongoose')

const LikeSchema = new Schema({
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            require: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
    }
)

module.exports = model('Like', LikeSchema)