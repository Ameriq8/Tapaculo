const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, required: true },
    authKey: { type: String, required: true, unique: true }
})

module.exports = model('User', userSchema)
