module.exports = class UserDto {
    email
    _id

    constructor(model) {
        this.email = model.email
        this._id = model._id
    }
}