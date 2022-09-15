const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('../config/passport');
const { localUserValidation } = require('../config/validation');
const uuidv4 = require('uuid').v4;
const imgur = require('imgur');

const client = new imgur.ImgurClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
})

// model
const User = require('../models/index').userModel;

// get user info
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { _id } = req.body;

    try {
        const {password, ...user} = await User.findOne({_id});
        console.log(user)
        res.status(200).json({
            user
        });
    } catch (err) {
        res.status(404).send('Cannot find user');
    }
})

router.patch('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {

    async function uploadImgur(base64, name) {
        base64 = base64.replace(/^data:image\/[a-z]+;base64,/, "");
        const response = await client.upload({
            image: base64,
            album: "CRPIQHY",
            title: name,
            name: name,
            type: 'base64',
        })
        const { link } = response.data;
        
        return link;
    }

    try {
        const newProfile = req.body;
        const { _id, data } = newProfile;

        if (data.thumbnail) {
            data.thumbnail = await uploadImgur(data.thumbnail, _id)
        }

        console.log(_id, data)

        const result = await User.findOneAndUpdate({ _id }, data, {
            new: true
        });

        console.log(result)

        res.send("update success")
    } catch (err) {
        res.status(400).send("Cannot patch profile")
    }
})

// check
router.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({isAuth: true});
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
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = req.user.generateJWT();
    const { password, ...user } = req.user.toObject();

    console.log(user);

    res.status(200).json({
        success: true,
        token: `jwt ${token}`,
        user: user
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
router.patch('/change_pwd', passport.authenticate('jwt', { session: false }), async(req, res) => {
    const { email, _id, password } = req.body;
    const filter = email || _id;
    let user = await User.findOne({filter});

    if (!user) {
        res.status(404).send('Cannot find user');
    }

    user.password = password;
    await user.save();
    res.status(200).send('finish changing the pwd.');
})

module.exports = router;