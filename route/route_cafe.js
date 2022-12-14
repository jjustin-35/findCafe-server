const router = require('express').Router();
const passport = require('../config/passport');
const User = require('../models').userModel;
const Cafe = require('../models').cafeModel;
const multer = require('multer');
const upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 }
});
const imgur = require('imgur');

const client = new imgur.ImgurClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
})

router.get('/', async (req, res) => {
    let { perPage, page = 0, sort , ...query } = req.query;
    
    const condition = {};
    // const isEmpty = (obj) => {
    //     for (let i in obj) {
    //         return false
    //     }

    //     return true;
    // }
    
    for (let prop in query) {
        const re = new RegExp("\\$gte|\\$lte|\\$gt|\\$lt", "g");
        let match;
        console.log(prop, query[prop])
        if (!prop) {
            continue;
        }

        if (prop === "keyword") {
            const re = new RegExp(query[prop])
            condition.keyword = {$or: [{name: { $regex: re, $options: "g" }}, {"address.country": { $regex: re, $options: "g" }}, {"address.districts": { $regex: re, $options: "g" }}, {"address.location": { $regex: re, $options: "g" }}, {"address.mrt": { $regex: re, $options: "g" }}]};

            continue;
        }

        let ranks = ['wifi', 'seat', 'quiet', 'tasty', 'cheap', 'music'];
        let value = query[prop];
        for (let rank of ranks) {
            if (prop === rank) {
                prop = "rank." + prop;
            }
        }
        query[prop] = value;

        if (prop === "star") {
            let starQuery = [];
            console.log(query[prop])
            for (let i of query[prop]) {
                starQuery.push(Number(i));
            }
            prop = "stars";
            query[prop] = { $in: starQuery };
        }
        
        if (typeof query[prop] === "string") {
            match = query[prop].match(re);
        }
        
        if (match) {
            const situation = {};
            let num = query[prop].replace(match, "");
            situation[match] = Math.round(Number(num));

            query[prop] = situation;
        } else {
            if (prop.match(/country|districts|location|mrt/g)) {
                let content = query[prop];
                if (prop === "mrt") {
                    let re = new RegExp(query[prop]);
                    content = { $regex: re, $options: "g" };
                }
                
                condition[`address.${prop}`] = content;

                continue;
            }
        }
        condition[prop] = query[prop];
    }

    console.log(condition)

    let cafe;
    // sort
    // descending
    let sorty = '-stars';
    if (sort) {
        // ascending
        if (sort == 'asc') {
            sorty = 'stars'
        }
    }
    // length
    let length = 0;
    const { keyword, ...conditions } = condition;
    let theCondition = conditions;
    if (keyword) {
        theCondition = {$and: [keyword, conditions]}
    }
   
    const array = await Cafe.find(theCondition);
    if (array) {
        length = array.length;
    }
    
    // pagination
    try {
        if (perPage && page) {
            cafe = await Cafe.find(theCondition).limit(perPage).sort(sorty).skip(perPage * page);
        } else {
            cafe = await Cafe.find(theCondition).sort(sorty)
        }
        

        const cafeRes = { cafes: cafe, length };
        res.json(cafeRes);

    }catch (err) {
        console.log(err);
        res.status(404).send('Cannot find result.');
    }    
})

router.get('/:cafe', async (req, res) => {
    const param = req.params.cafe;
    console.log(param)

    try{
        const cafe = await Cafe.findOne({ name: {$regex: param} });

        if (cafe) {
            res.json(cafe);
        } else {
            res.send("cannot find")
        };
    } catch (err) {
        console.log(err)
        res.status(404).send("something wrong");
    }
})

router.post('/add', passport.authenticate('jwt', {session: false}), async (req, res) => {

    const {name, branch, tel, price, address, time, stars, user, menu, pics} = req.body;

    // menu, img
    // upload to imgur
    async function uploadImgur(array, name) {
        const imgArr = []; 
        await array.forEach(async (element) => {
            element.pic = element.pic.replace(/^data:image\/[a-z]+;base64,/, "");
            const response = await client.upload({
                image: element.pic,
                album: name === "menu" ? "uQxdwxN" : "c2DqJEr",
                title: element.name,
                name: element.name,
                type: 'base64',
            })
            const { title, link } = response.data;
            imgArr.push({title, link});
        })

        return imgArr;
    }

    function picsArray(pic, theName) {
        const array = [];
        if (pic.length == 0) return [];
        pic.forEach((element, i) => {
            let obj = {};
            obj.name = `${name}_${theName}_${i}`;
            obj.pic = element;

            array.push(obj);
        })

        return array;
    }
    
    let menuArray = await uploadImgur(picsArray(menu, 'menu'), "menu");
    let imgArray = await uploadImgur(picsArray(pics, 'img'), "pics");

    // user
    let userId;
    try {
        let theUser = await User.findOne({ email: "jjusttin11@gmail.com" });
        if (theUser) {
            userId = theUser._id;
        }
    } catch (err) {
        return res.status(404).json(err)
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

module.exports = router;