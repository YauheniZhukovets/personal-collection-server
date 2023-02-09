const {Schema, model} = require('mongoose')

const CommentSchema = new Schema({
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
        text: {type: String, require: true, trim: true},
    },
    {
        timestamps: {
            createdAt: "created",
            updatedAt: "updated",
        }
    }
)

module.exports = model('Comment', CommentSchema)