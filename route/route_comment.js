const router = require('express').Router();
const Comment = require('../models').commentMedel;
const User = require('../models').userModel;
const Cafe = require('../models').cafeModel;


router.get('/:cafe', async (req, res) => {
    const { cafe } = req.params;
    const { sort, ...otherQuery } = req.query;

    const condition = {};

    condition.cafe = cafe;
    for (let prop in otherQuery) {
        condition[prop] = otherQuery[prop]
    }

    let sorty = 'stars';
    if (sort == 'lessFirst') {
        sorty='-stars'
    }

    let comments = await Comment.find(condition).limit(5).sort(sorty);
})

router.post('/:cafe/add', async (req, res) => {
    const { cafe } = req.params;
    const { user, stars, tags, post } = req.body;

    let newComment = await new Comment({
        cafe, user, stars, tags, post
    });

    await newComment.save();
})

router.put('/:cafe/edit', (req, res) => {
    
})