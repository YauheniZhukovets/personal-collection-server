const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
        name: {type: String},
        email: {type: String, unique: true, require: true},
        password: {type: String, require: true},
        isAdmin: {type: Boolean, require: true},
        isBlocked: {type: Boolean},
    },
    {
        timestamps: true
    }
)

module.exports = model('User', UserSchema)