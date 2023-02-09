const {Schema, model} = require('mongoose')

const CollectionSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {type: String, required: true},
        theme: {type: String, required: true},
        description: {type: String, required: true},
        itemsCount: {type: Number, default: 0},
        image: {type: String, default: ''}
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        }
    }
)

module.exports = model('Collection', CollectionSchema)