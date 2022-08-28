const mongoose = require('mongoose');
const { Schema } = mongoose;

const cafeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    branch: {
        type: String,
        minLength: 1,
        maxLength: 255,
    },
    tel: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 12
    },
    address: {
        country: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 10,
        },
        districts: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 10,
        },
        location: {
            type: String,
            minLength: 2,
            maxLength: 255
        }
    },
    time: [{
        weekday: {
            type: String,
            required: true,
        },
        open: {
            type: String,
            required: true,
        },
        close: {
            type: String,
            required: true,
        }
    }],
    price: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    menu: [{
        name: {
            type: String,
        },
        pic: {
            type: String,
        },
    }],
    img: [{
        name: String,
        pic: String,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
        required: true,
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]
})

// cafeSchema.methods.countStars = function () {
//     const user = this;


//     user.comment
// }

module.exports = mongoose.model('Cafe', cafeSchema);