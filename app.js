const express = require('express')
const passport = require('passport')
const session = require('express-session')
const passportSetup = require('./config/passport-setup')
const path = require('path')
const bodyParser = require('body-parser')
const fs =  require('fs')
const env = require('dotenv')
env.config()
const app = express()

// config for ssl certificate self signed
const httpsOptions = {
  key: fs.readFileSync(path.join(process.env.MY_CERT_KEY)),
  cert: fs.readFileSync(path.join(process.env.MY_CERT))
}

// config for server in https
const https = require('https')
const socket = require('socket.io')
const server = https.createServer(httpsOptions, app).listen(process.env.MY_PORT, (err) => {
  if (err) console.log(err)
  else console.log('Listening on port: ==> ', process.env.MY_PORT)
})

// establish socket connection
const io = socket(server) 
io.on('connection', () => { console.log('Connected to socket!') })
app.set('socketio', io)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.MY_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', require('./routes/auth.js'))
app.use('/webhook', require('./routes/webhook.js'))

app.get('/', function (req, res) { res.render('index', { title: 'Login page' }) })
app.get('*', function (req, res) { res.status(200).render('error', { message: '404 resource not found' }) })
