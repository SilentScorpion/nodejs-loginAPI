const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();




//Get all the users that have previously registered to the App
router.get('/getUsers', (req,res) => {
    User.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => console.log('some error'));
});

//Get a specific user
router.get('/:id', (req,res) => {
    
    User.findById(req.params.id)
    .then(user => {
        if(user)
            res.status(200).listenerCountjson(user);
        else
            res.status(404).json({status: '404',message: "No user found"});
    })
    .catch(err => console.log('error while return a user' + err));
});


//Check if User already exists, if it does, then don't allow it to save, send status message
//If user doesn't already exist, then Hash the password and save() to db.
//Register User (Post)
router.post('/register', (req,res) => {

    const {name, email, password, password2,phoneNo} = req.body;
    
    //All server side checks to ensure that proper data is coming into the db
    var errors = [];
    if(password != password2)
        errors.push({msg: 'Passwords do not match ::: No Data saved to db'});
    if(!name || !email || !password || !password2 || !phoneNo)
        errors.push({msg: 'Please enter all the fields::: No Data saved to db'});

    if(errors.length > 0){
        res.json(errors);
    
    }
    //No errors exist in the data coming from the client app.
    else{
        User.findOne({email: email})
        .then(user => {
            if(user){
                  res.json({message: 'User already registered'});
            }else{
                //Save a new User

                //Generate a salted hash of the password and then save

              const newUser = new User({
                  name: name,
                  email: email,
                  phoneNo: phoneNo,
                  password
              });

              bcrypt.genSalt(10, (err,salt) => {
                if(err) throw err;
                else{
                    bcrypt.hash(password,salt, (err, enPass) => {
                        newUser.password = enPass;
                        //Add User to db
                        newUser.save()
                        .then(user => {
                            console.log('saved succesfully to db');
                            res.status(200).json({message: 'success'});
                        })
                        .catch(err => console.log(err));
                    });
                }
              });
      
        
            }
        })
        .catch(err => console.log(err));
    }
  
    
 

});

//Login to the Application
router.post('/login', (req,res,next) => {

    //Getting the user back
    //You use some kinda database (mongoose MongoDB)
    const {email,password}= req.body;

    User.findOne({email: email})
    .then(user => {
        if(user){
            //User exists, check password
            bcrypt.compare(password, user.password, (err, same) => {
                if(err) throw err;

                if(!same){
                    res.json({message: 'User not authorised ::: Password Mismatch'});
                }
                else{
                    res.json({message: 'User Authorized'});
                }
            });
        }
        else{
            res.json({message:'User does not exist'});
        }
    })
    .catch(err => console.log(err))
   
});



module.exports = router;