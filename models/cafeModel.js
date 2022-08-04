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
        district: {
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
            type: Date,
            required: true,
        },
        open: {
            type: Date,
            required: true,
        },
        close: {
            type: Date,
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
        menuName: {
            type: String,
        },
        menuPic: {
            type: String,
        },
    }],
    img: [{
        imgName: String,
        imgPic: String,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }
})

module.exports = mongoose.model('Cafe', cafeSchema);