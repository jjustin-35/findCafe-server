const router = require('express').Router();
const passport = require('../config/passport');
const User = require('../models').userModel;
const Cafe = require('../models').cafeModel;

router.post('/add', passport.authenticate('jwt', {session: false}), async (req, res) => {

    console.log(req.body);
    const {name, branch, tel, price, address, time, stars, user, menu, pics} = req.body;

    // // menu, img
    function picsArray(pic, theName) {
        const array = [];
        if (pic.length == 0) return [];
        pic.forEach((element, i) => {
            let obj = {};
            obj[`${theName}Name`] = `${name}_${theName}_${i}`;
            obj[`${theName}Pic`] = element;

            array.push(obj);
        })

        return array;
    }
    
    let menuArray = picsArray(menu, 'menu');
    let imgArray = picsArray(pics, 'img');

    // user
    let userId;
    try {
        let theUser = await User.findOne({ email: user.email });
        if (theUser) {
            userId = theUser._id;
        }
    } catch (err) {
        return res.status(401).json(err)
    }
    
    // new cafe
    let newCafe = new Cafe({
        name,
        branch,
        tel,
        address,
        price,
        time,
        stars,
        menu: menuArray,
        img: imgArray,
        user: userId,
    })

    newCafe.save()
        .then(()=>{console.log('cafe has been saved.')})
});

router.get('/find', async (req, res) => {
    const { perPage, page, sort, ...anotherQuery } = req.query;

    const condition = {};
    for (let prop in anotherQuery) {
        condition[prop] = anotherQuery[prop];
    }

    let lastId;
    let cafe;
    // sort
    let sorty = 'stars';
    if (sort) {
        if (sort == 'lessFirst') {
            sorty = '-stars'
        }
    }
    // pagination
    try {
        if (page == 1) {
            cafe = await Cafe.find(condition).limit(perPage).sort(sorty);
        } else {
            condition._id = {$gt: lastId};
            cafe = await Cafe.find(condition).limit(perPage).sort(sorty);
        }
        lastId = cafe[cafe.length - 1]._id;

        res.json(cafe);
    }catch (err) {
        console.log(err);
        res.status(401).send('Cannot find result.');
    }    
})

module.exports = router;