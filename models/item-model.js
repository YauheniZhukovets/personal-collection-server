const {Schema, model} = require('mongoose')

const ItemSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        collectionName: {
            type: Schema.Types.ObjectId,
            ref: 'Collection',
            required: true,
        },
        title: {type: String, required: true},
        countComments: {type: Number, default: 0},
        tags: [
            {type: Object}
        ],
        likes: [
            {type: Object}
        ],

        string1: {type: String},
        string2: {type: String},
        string3: {type: String},
        text1: {type: String},
        text2: {type: String},
        text3: {type: String},
        number1: {type: Number},
        number2: {type: Number},
        number3: {type: Number},
        boolean1: {type: Boolean},
        boolean2: {type: Boolean},
        boolean3: {type: Boolean},
        date1: {type: Date},
        date2: {type: Date},
        date3: {type: Date},
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        }
    }
)

module.exports = model('Item', ItemSchema)