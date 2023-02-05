const {Schema, model} = require('mongoose')

const ItemSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        collectionId: {
            type: Schema.Types.ObjectId,
            ref: 'Collection',
            required: true,
        },
        name: {type: String, required: true},
        tags: [{type: String}],
    },
    {
        timestamps: true
    }
)

module.exports = model('Item', ItemSchema)