module.exports = class UserDto {
    name
    email
    _id
    isAdmin
    isBlocked

    constructor(model) {
        this.email = model.email
        this._id = model._id
        this.name = model.name
        this.isAdmin = model.isAdmin
        this.isBlocked = model.isBlocked
    }
}