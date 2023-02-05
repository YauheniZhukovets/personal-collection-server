const {Schema, model} = require('mongoose')

const CollectionSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {type: String, required: true},
        theme: {type: String, required: true},
        description: {type: String, required: true},
        itemCount: {type: Number, default: 0},
        image: {type: String}
    },
    {
        timestamps: true
    }
)

module.exports = model('Collection', CollectionSchema)