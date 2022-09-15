const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/index').userModel;
const { OauthUserValidation, localUserValidation } = require('./validation');

// 序列化，把user id取出放入session
passport.serializeUser((user, done) => {
    console.log('serializing user');
    done(null, user._id);
});
// 反序列化，把session中的id取出，找尋符合id的資料(放入req.user)
passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    done(null, user);
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    // 讓 varify callback 函式可以取得 req 物件
    passReqToCallback: true 
}, async (req, email, password, done) => {
    try {
        let user = await User.findOne({ email }).populate('comment');
        if (!user) {
            return done(null, false, { message: 'Email/password is wrong.' });
        } else {
            let isVerified = await user.verifyPassword(password);

            if (isVerified) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Email/password is wrong.'})
            }
        }
    } catch (err) {
        return done(null, err)
    }
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:3600/auth/google/callback',
}, async function verify(acccessToken, refreshToken, profile, done) {
    try {
        console.log(profile)
        const { sub, name, picture, email } = profile._json;
        let user = await User.findOne({ id: sub });
        if (!user) {
            const userData = {name,
                email,
                thumbnail: picture,
                id: sub,}
            const { error } = OauthUserValidation(userData);
            if (error) return done(error);

            user = new User(userData);

            await user.save();
        }

        done(null, user);
    }
    catch(err) {
        console.log(err);
        return done(err);
    }
}))

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: 'http://localhost:3600/auth/facebook/callback',
    profileFields: ['id', 'email', 'displayName', 'picture.type(large)'],
}, async function verify(accessToken, refreshToken, profile, done) {
    try {
        const userData = {...profile._json};
        userData.picture = userData.picture.data.url;
        let user = await User.findOne({ email: userData.email });

        if (!user) {
            const { error } = OauthUserValidation(userData);
            if (error) return done(error);

            user = new User(userData);

            await user.save();
        }

        done(null, user);

    } catch (err) {
        console.log(err);
        return done(err)
    }
}))

// JWT
passport.use(new JWTstrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.PASSPORT_SECRET
}, function verify(jwt_payload, done) {
    User.findOne({ email: jwt_payload.email }, (err, user) => {
        if (err) return done(err);

        if (user) {
            done(null, user);
        } else {
            done(null, false)
        }
    })
})
)

module.exports = passport;