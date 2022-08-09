const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// model
const User = require('../models/index').userModel;

// sign up
router.post('/sign_up', async (req, res) => {
    const {name, thumbnail, address, email, password } = req.body;
    const result = await User.findOne({ email });

    if (!result) {
        const newUser = new User({
            name, thumbnail, address, email, password
        });

        newUser.save()
            .then(() => {
                res.json({
                    saved: true,
                    msg: 'User has been saved.'
                });
            })
    } else {
        res.status(400).json({
            saved: false,
            msg: 'User has existed.'
        })
    }
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    let authResult;

    if (user) {
        const { password } = user;
        const hash = password;
        let compare = await bcrypt.compare(password, hash);
        if (compare) {
            // 驗證成功
            const token = await user.generateAuthToken();

            res.json({
                login: true,
                msg: 'login success!',
                token
            })
        } else {
            authResult = false;
        }
    } else {
        authResult = false;
    }

    if (!authResult) {
        res.json({
            login: false,
            msg: 'Email/password is wrong. Please check your email/password.'
        })
    }
})

module.exports = router;