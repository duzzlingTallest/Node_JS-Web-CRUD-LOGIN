const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config();
const hbs = require("hbs")
const path = require("path")
var bodyParser = require('body-parser')

var cookieParser=require('cookie-parser')
app.use(cookieParser())

const PORT = process.env.PORT
const DB_URL= process.env.DB_URL

mongoose.connect(DB_URL).then(()=>{
    console.log("DB is connected");
}).catch(error=>{
    console.log(error);
})

const publicPath = path.join(__dirname,"../public")
const viewPath = path.join(__dirname,"../templetes/views")
const partialPath = path.join(__dirname,"../templetes/partials")

app.set("view engine","hbs")
app.set("views",viewPath) 
app.use(express.static(publicPath))
hbs.registerPartials(partialPath)
app.use(bodyParser.urlencoded({ extended: false })) // when data come from the form so we use ==> "body parser"
app.use("/",require("../router/userrouter"))

app.listen(PORT,()=>{
    console.log("Server Is Running On PORT NO : - "+PORT);
}) 