const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema } = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be empty!'],
        minLength: 2,
        maxLength: 50,
    },
    thumbnail: {
        type: String,
    },
    address: {
        country: {
            type: String,
            minLength: 2,
            maxLength: 10,
        },
        district: {
            type: String,
            minLength: 2,
            maxLength: 10,
        },
        location: {
            type: String,
            minLength: 2,
            maxLength: 50,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 50,
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 1024,
    },
    id: {
        type: String,
    },
    myCoffee: [{
        type: Schema.Types.ObjectId,
        ref: "Cafe"
    }]
})

userSchema.methods.hashPassword = async function () {
    const user = this;
    if (user.password === null) {
        return "";
    }
    const hash = await bcrypt.hash(user.password, 10);
    this.password = hash;
};

userSchema.methods.verifyPassword = async function (password) {
    const user = this;
    const isVerified = await bcrypt.compare(password, user.password);
    return isVerified;
}

userSchema.methods.generateJWT = function () {
    const user = this;
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.PASSPORT_SECRET, { expiresIn: '1 day' });

    return token;
};

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        await user.hashPassword();
    }
    console.log('User data is saving...');
    next();
});

module.exports = mongoose.model('User', userSchema);