const express = require('express');
const app = express()
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors')




//middleware
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

//fireup mongdb
const mongoURI = process.env.MONGO_URI || ""
mongoose.connect(mongoURI)
    .then(()=>{
        console.log('database connected!')
    })
    .catch((err)=>{
        console.log(err.message)
    })

//api Auth
const userAuthRoute = require('./route/User.route')
app.use('/api/v1/',userAuthRoute)

//fireup server
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}...`)
})