const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const UserSchema = mongoose.Schema({
    email: {
        type: String
    },
    name: {
        type: String
    }
})
module.exports = mongoose.model('users', UserSchema)