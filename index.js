const express = require('express')
const {engine} = require('express-handlebars')
const bodyParser = require('body-parser')
const routs = require('./routs/appRouts.js')
const path = require('node:path')
const session = require('express-session')


const app = express()

app.set('trust proxy', 1)
app.use(session({
    secret: "bananaComArroz",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, "static"))) 

app.use('/', routs)

app.listen(8081, ()=>{
    console.log("funcionou")
})
