const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        maxLength: 255,
        minLength: 5,
    },
    password: {
        type: String,
        required: true,
        maxLength: 1024,
        minLength: 8,
    },
    name: {
        type: String,
        required: true,
        default: 'admin'
    },
    charactor: {
        type: String,
        enum: ['admin', 'editor'],
        required: true
    }
})

adminSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password')) {
        let hash = await bcrypt.hash(user.password, 10);
        user.password = hash;

        await user.save();
    }
})

module.exports = mongoose.model('Admin', adminSchema);