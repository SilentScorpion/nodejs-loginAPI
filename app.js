const express = require('express');
const mongoose = require('mongoose');
//Passport authentication
const passport = require('passport');



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));

//Passport config
require('./config/passport')(passport);

//Initialize the Passport module here
app.use(passport.initialize());
app.use(passport.session());

//Connection to the database
mongoose.connect('mongodb+srv://admin:admin@cluster0-1gy8f.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}, (db) => {
    console.log('connected to the db');
});


//Use the routes
app.use('/user', require('./routes/user'));


app.listen(5000, () => console.log('listening to port 5000'));