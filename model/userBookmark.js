const mongoose = require('mongoose');
const UserBookmark = mongoose.Schema({
    email: {
        type: String
    },
    data: {
        type: Object
    }
})
module.exports = mongoose.model('bookmarks', UserBookmark)