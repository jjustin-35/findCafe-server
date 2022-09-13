const router = require('express').Router();
const Comment = require('../models').commentMedel;
const User = require('../models').userModel;
const Cafe = require('../models').cafeModel;


router.get('/:cafe', async (req, res) => {
    const { cafe } = req.params;
    const { sort, ...otherQuery } = req.query;

    const re = new RegExp(cafe);

    const condition = {};

    condition.cafe = await Cafe.findOne({ name: {$regex: re, $options: "g"} });
    if (!condition.cafe) { res.status(404).send("cannot find") };
    for (let prop in otherQuery) {
        condition[prop] = otherQuery[prop]
    }

    let sorty = 'stars';
    if (sort == 'lessFirst') {
        sorty='-stars'
    }

    let comments = await Comment.find(condition).sort(sorty).populate('user');

    res.json(comments);
})

router.post('/add', async (req, res) => {
    try {
        const {cafe, user, stars, tags, post } = req.body;

        const theCafe = await Cafe.findById(cafe);
        const cafeId = theCafe._id;

        const theUser = await User.findOne({ email: user });
        const userId = theUser._id;

        let newComment = new Comment({
        cafe: cafeId, user: userId, stars, tags, post
        });

        await newComment.save();
    
        theUser.comment.push(newComment);
        await theUser.save();
        
        res.send("add success");
    } catch (err) {
        console.log(err)
        res.status(404).send("error")
    }
})

module.exports = router;