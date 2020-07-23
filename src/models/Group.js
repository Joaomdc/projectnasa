const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    title: String,
    description: String,
    picture: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hashtag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hashtag'
    },
    participants: Number
});

module.exports = mongoose.model('Group', GroupSchema);