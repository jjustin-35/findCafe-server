const router = require('express').Router();
const passport = require('../config/passport');
const User = require('../models').userModel;
const Cafe = require('../models').cafeModel;

app.post('/add', passport.authenticate('jwt'), (req, res) => {

    console.log(req.body);
    const {name, branch, tel, price, address, user} = req.body;

    // // menu, img
    function picsArray(pic, theName) {
        const array = [];
        pic.forEach((element, i) => {
            let obj = {};
            obj[`${theName}Name`] = `${name}_${theName}_${i}`;
            obj[`${theName}Pic`] = element;

            array.push(obj);
        })

        return array;
    }
    let menuArray = picsArray(menu, 'menu');
    let imgArray = picsArray(img, 'img');

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
});