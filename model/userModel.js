const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    email: {
        type: String
    },
    name: {
        type: String
    }
})
module.exports = mongoose.model('users', UserSchema)