
"use strict";
require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
app.use(helmet());
app.disable('x-powered-by');
//Tools
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Github webhook middleware
const githubMiddleware = require('github-webhook-middleware')({ secret: process.env.HOOK_KEY });
/*  PASSPORT SETUP  */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj, cb) { cb(null, obj); });
/*  GITHUB AUTH  */
const GitHubStrategy = require('passport-github').Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://cscloud401.lnu.se/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
}));
app.get('/auth/github',  passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) { res.redirect('/success'); });
/*   Trying Github Oauth */
const port = process.env.PORT || 8000;
//Route
app.use('/success', require('./routes/githubConnect.js'));
app.get('/', (req, res) => res.sendFile('auth.html', { root: path.join(__dirname, '/public')}));
app.get('/error', (req, res) => res.send("error logging in"));
//Start Server
const server = app.listen(port, (err) => {
    if (err) console.log(err)
    else console.log('Express is up on cscloud401.lnu.se:3000/');
});
// Creating web socket on server side ------------------------
let io = require('socket.io')(server);
//Listening to webhooks
app.post('/hookie', githubMiddleware, function (req, res) {
    res.status(200);
    res.send();
    // action, title, user for the notification
    let notification = {
        action: req.body.action,
        user: req.body.issue.user.login,
        title: req.body.issue.title,
    };
    //trigger client to update.
    let xGithubEvent = req.headers['x-github-event'];
    //Object to hold only the required info from the issue
    let context = {
        id: req.body.issue.id,
        title: req.body.issue.title,
        issueBody: req.body.issue.body,
        comments: req.body.issue.comments,
        issueUrl: req.body.issue.url,
        created_at: req.body.issue.created_at,
        updated_at: req.body.issue.updated_at
    };
    if (xGithubEvent === 'issues') {
        io.emit('issue webhook', notification);
        io.emit('issue body', context);
    } else if (xGithubEvent === 'issue_comment') {
        io.emit('comment webhook', notification);
        io.emit('issue body', context);
    }
});
