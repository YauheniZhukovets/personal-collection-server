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

        string1: {type: String, default: null},
        string2: {type: String, default: null},
        string3: {type: String, default: null},
        text1: {type: String, default: null},
        text2: {type: String, default: null},
        text3: {type: String, default: null},
        number1: {type: Number, default: null},
        number2: {type: Number, default: null},
        number3: {type: Number, default: null},
        boolean1: {type: Boolean, default: null},
        boolean2: {type: Boolean, default: null},
        boolean3: {type: Boolean, default: null},
        date1: {type: String, default: null},
        date2: {type: String, default: null},
        date3: {type: String, default: null},
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        }
    }
)

module.exports = model('Item', ItemSchema)