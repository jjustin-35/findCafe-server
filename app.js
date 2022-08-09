const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require('multer');
const upload = multer();
const cors = require('cors');

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

// self middleware
app.use('/data', route_data);
app.use('/auth', route_auth);

app.get('/', (req, res) => {
    res.send('this is home page.')
})

app.post('/add_cafe', (req, res) => {

    console.log(req.body);
    const {name, branch, tel, price, address} = req.body;

    // // menu, img
    function pics(pic, theName) {
        const array = [];
        pic.forEach((element, i) => {
            let obj = {};
            obj[`${theName}Name`] = `${name}_${theName}_${i}`;
            obj[`${theName}Pic`] = element;

            array.push(obj);
        })

        return array;
    }
    let menuArray = pics(menu, 'menu');
    let imgArray = pics(img, 'img');

    // // user
    // models.userModel.findOne({ user })
    //     .then((data) => {
    //         user = data._id;
    //     })
    
    // // new cafe
    // let newCafe = new models.cafeModel({
    //     name,
    //     branch,
    //     tel,
    //     address: {
    //         city,
    //         district,
    //         location,
    //     },
    //     time: timeArray,
    //     price,
    //     menu: menuArray,
    //     img: imgArray,
    //     user,
    // })

    // newCafe.save().then(() => {
    //     console.log('New cafe is saved.');
    // })

    // // comment
    // let cafeId;
    // newCafe.findOne({ name }).then((data) => {
    //     cafeId = data._id;
    // })
    // let newComment = new models.commentMedel({
    //     cafe: cafeId,
    //     user,
    //     stars,
    //     tags,
    //     post: comment
    // });

    // newComment.save().then(() => {
    //     console.log('New comment is saved.');
    // })
});



app.listen(3600, () => {
    console.log('Server is running on port 3600.')
})

