const mongoose = require('mongoose');
const { Schema } = mongoose;

const cafeSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "unknown",
        maxLength: 255,
    },
    tel: {
        type: String,
        minLength: 5,
        maxLength: 12
    },
    url: {
        type: String, 
    },
    address: {
        country: {
            type: String,
            required: true,
            maxLength: 10,
            default: "unknown"
        },
        districts: {
            type: String,
            required: true,
            maxLength: 10,
            default: "unknown"
        },
        location: {
            type: String,
            maxLength: 255,
            default: "unknown"
        },
        mrt: {
            type: String,
        }, 
        latitude: Number,
        longitude: Number
    },
    time: {
        // weekday: {
        //     type: String,
        //     default: "每天",
        // },
        open_time: String,
    },
    price: {
        type: String,
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
    stars: {
        type: Number,
        min: 0,
        max: 5,
        default: 1,
        required: true,
    },
    rank: {
        wifi: Number,
        seat: Number,
        quiet: Number,
        tasty: Number,
        cheap: Number,
        music: Number
    },
    limited_time: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]
})


//     user.comment
// }

module.exports = mongoose.model('Cafe', cafeSchema);