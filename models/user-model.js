const {Schema, model} = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new Schema({
        name: {type: String, unique: true, require: true},
        email: {type: String, unique: true, require: true},
        password: {type: String, require: true},
        collectionsCount: {type: Number, default: 0},
        isAdmin: {type: Boolean, default: false},
        isBlocked: {type: Boolean, default: false},
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        }
    }
)
UserSchema.plugin(findOrCreate);

module.exports = model('User', UserSchema)