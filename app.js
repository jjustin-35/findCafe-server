const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require('multer');
const upload = multer();
const cors = require('cors');
const passport = require('./config/passport');

const route_data = require('./route/route_data');
const route_user = require('./route/route_user');
const route_cafe = require('./route/route_cafe');
const route_comment = require('./route/route_comment');

// models
const models = require('./models/index');

mongoose.connect(process.env.MONGODB_URL, (err) => {
    if (err) { console.log(err) } else {
        console.log('mongoose is connected.')
    }
})

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(upload.array());
// cors 預設不開放(不開放非相同網域獲取資料)，需要引入cors package(預設全開放) 
app.use(cors());
// 初始化passport、保持login state
app.use(passport.initialize());

// route
app.use('/data', route_data);
app.use('/auth', route_user);
app.use('/cafe', route_cafe);
app.use('/comment', route_comment);

app.get('/', (req, res) => {
    res.send('this is home page.')
})

app.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('success login')
})

app.get('/policy', (req, res) => {
    res.send('this is policy')
})

app.get('*', (req, res) => {
    res.status(404).json('Cannot find the page');
})

app.listen(process.env.PORT || 3600, () => {
    console.log('Server is running on port 3600.')
})

