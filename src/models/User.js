const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    username: String,
    password: String,
    state: String,
    country: String,
    picture: String,
    help: Boolean,
})

module.exports = mongoose.model('User', UserSchema);