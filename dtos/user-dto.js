module.exports = class UserDto {
    name
    email
    _id
    isAdmin
    isBlocked
    collectionsCount
    created
    updated

    constructor(model) {
        this.email = model.email
        this._id = model._id
        this.name = model.name
        this.isAdmin = model.isAdmin
        this.isBlocked = model.isBlocked
        this.collectionsCount = model.collectionsCount
        this.created = model.created
        this.updated = model.updated
    }
}