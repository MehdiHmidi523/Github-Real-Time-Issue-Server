const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const env = require('dotenv')
env.config()

passport.use(new GitHubStrategy({
    clientID: process.env.MY_CLIENT_ID,
    clientSecret: process.env.MY_CLIENT_SECRET,
    callbackURL: '/auth/redirect'
}, (accessToken, refreshToken, profile, cb) => {
    cb(null, {
        accessToken: accessToken,
        profile: profile
    })
}
))
passport.serializeUser(function (user, cb) { cb(null, user) })
passport.deserializeUser(function (user, cb) { cb(null, user) })