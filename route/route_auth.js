const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('../config/passport');
const { localUserValidation } = require('../config/validation');
const uuidv4 = require('uuid').v4;

// model
const User = require('../models/index').userModel;

// get user info
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { _id } = req.body;

    try {
        const {password, ...user} = await User.findById(_id);
        res.status(200).json({
            user
        });
    } catch (err) {
        res.status(404).send('Cannot find user');
    }
})

// sign up
router.post('/sign_up', async (req, res) => {
    console.log(req.body);
    const {email} = req.body;
    const result = await User.findOne({ email });
    try {
        if (!result) {
            const userData = { ...req.body };
            userData.id = uuidv4();
            const { error } = localUserValidation(userData);
            
            if (error) return res.status(400).send(error.details[0].message);

            const newUser = new User(userData);
            newUser.save()
                .then(() => {
                    res.json({
                        success: true,
                        msg: 'User has been saved.'
                    });
                })
        } else {
            res.status(400).json({
                success: false,
                msg: 'User has existed.'
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            msg: 'something is wrong',
        })
    }
    
})

// local login
router.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
    const token = req.user.generateJWT();
    const { _id } = req.user;

    res.status(200).json({
        success: true,
        token: `jwt ${token}`,
        user: _id
    })
})

// google login
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'], }));

router.get('/google/callback', passport.authenticate('google', {session: false}), (req, res) => {
    const token = req.user.generateJWT();
    res.status(200).json({
        success: true,
        token: `jwt ${token}`
    })
})

// fb
router.get('/facebook', passport.authenticate('facebook', {scope: ['email', 'user_location']}))

router.get('/facebook/callback', passport.authenticate('facebook', {session: false}), (req, res) => {
    const token = req.user.generateJWT();
    res.status(200).json({
        success: true,
        token: `jwt ${token}`
    })
})

// changepwd

module.exports = router;