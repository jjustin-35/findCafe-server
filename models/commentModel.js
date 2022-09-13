const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
    cafe: {
        type: Schema.Types.ObjectId,
        ref: 'Cafe',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    tags: {
        type: [String],
        required: true,
        minlength: 1,
    },
    post: {
        type: String,
    },
    time: {
        type: Date,
        default: Date.now(),
        required: true,
    }
})

module.exports = mongoose.model('Comment', commentSchema);