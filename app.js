const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require('multer');
const upload = multer();
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

const route_data = require('./route/route_data');
const route_auth = require('./route/route_auth');

// models
const models = require('./models/index');

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('mongoose is connected.')
})

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array());
// cors 預設不開放(不開放非相同網域獲取資料)，需要引入cors package(預設全開放)
app.use(cors());
// 使用session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
// 初始化passport、保持login state
app.use(passport.initialize());
app.use(passport.session());

// route
app.use('/data', route_data);
app.use('/auth', route_auth);

app.get('/', (req, res) => {
    res.send('this is home page.')
})

app.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('success login')
})

app.get('/policy', (req, res) => {
    res.send('this is policy')
})

app.listen(3600, () => {
    console.log('Server is running on port 3600.')
})

