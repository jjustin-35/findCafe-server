const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        city: {
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
        required: true,
        minLength: 8,
        maxLength: 1024,
    }
})

userSchema.methods.hashPassword = async function(){
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
};

userSchema.pre('save', (next) => {
    const user = this;
    console.log(user.isModified());
    if (user.isModified()) {
        user.hashPassword()
    }
    console.log('User data is saving...');
    next();
});

module.exports = mongoose.model('User', userSchema);