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
    },
    tokens: [{
        token: {
            type: String,
            default: ""
        }
    }]
})

userSchema.methods.hashPassword = async function(){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
};

// 建立 userSchema 實例(Document)能使用的方法：產生 JWT
userSchema.methods.generateAuthToken = async function () {
    // this 指向當前的使用者實例
    const user = this
    // 產生一組 JWT
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    // 將該 token 存入資料庫中：讓使用者能跨裝置登入及登出
    user.tokens = user.tokens.concat({ token });
    // user是一個obj我當然能直接修改阿，改完再save就好啊
    await user.save()
    // 回傳 JWT
    return token
  }

userSchema.pre('save', (next) => {
    const user = this;
    console.log(user.isModified('password'));
    if (user.isModified()) {
        user.hashPassword();
    }
    console.log('User data is saving...');
    next();
});

module.exports = mongoose.model('User', userSchema);