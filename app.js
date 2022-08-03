const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// models
const models = require('./models/index');

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('mongoose is connected.')
})

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('this is home page.')
})

app.post('/add_cafe', (req, res) => {

    console.log(req.body);
    // const { name, branch, tel, city, district, location, time, price, menu, img, user, stars, tags, comment } = req.body;
    // // time is an array
    // let timeArray = [];
    // for (let i = 0; i < time.length; i += 3) {
    //     timeArray.push({
    //         weekday: time[i],
    //         open: time[i + 1],
    //         close: time[i + 2],
    //     })
    // }
    // // menu, img
    // function pics(pic, theName) {
    //     const array = [];
    //     pic.forEach((element, i) => {
    //         let obj = {};
    //         obj[`${theName}Name`] = `${name}_${theName}_${i}`;
    //         obj[`${theName}Pic`] = element;

    //         array.push(obj);
    //     })

    //     return array;
    // }
    // let menuArray = pics(menu, 'menu');
    // let imgArray = pics(img, 'img');

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

