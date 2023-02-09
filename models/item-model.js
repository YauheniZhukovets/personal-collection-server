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

        string1: {
            name: {type: String, default: ''},
            value: {type: String, default: null}
        },
        string2: {
            name: {type: String, default: ''},
            value: {type: String, default: null}
        },
        string3: {
            name: {type: String, default: ''},
            value: {type: String, default: null}
        },
        text1: {
            name: {type: String, default: ''},
            value: {type: String, default: null}
        },
        text2: {
            name: {type: String, default: ''},
            value: {type: String, default: null}
        },
        text3: {
            name: {type: String, default: ''},
            value: {type: String, default: null}
        },
        number1: {
            name: {type: String, default: ''},
            value: {type: Number, default: null}
        },
        number2: {
            name: {type: String, default: ''},
            value: {type: Number, default: null}
        },
        number3: {
            name: {type: String, default: ''},
            value: {type: Number, default: null}
        },
        boolean1: {
            name: {type: String, default: ''},
            value: {type: Boolean, default: null}
        },
        boolean2: {
            name: {type: String, default: ''},
            value: {type: Boolean, default: null}
        },
        boolean3: {
            name: {type: String, default: ''},
            value: {type: Boolean, default: null}
        },
        date1: {
            name: {type: String, default: ''},
            value: {type: Date, default: null}
        },
        date2: {
            name: {type: String, default: ''},
            value: {type: Date, default: null}
        },
        date3: {
            name: {type: String, default: ''},
            value: {type: Date, default: null}
        },
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        }
    }
)

module.exports = model('Item', ItemSchema)