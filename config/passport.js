const mongoose = require('mongoose');
const User = require('../models/User');
const { login } = require('../controller/users');
const { isValidObjectId } = require('../utils/common');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// module.exports = (passport) =>{

passport.use(new LocalStrategy({
    usernameField : 'mobile',
    passwordField : 'password',
    },async (username,password,done) =>{
    console.log('passport local strategy checking user',username);
    let user = null;
    try{
      user = await login(username,password);
    }
     catch(err){
      return done(err)
    };

    return done(null,user);
  }));
// Serialization and Deserialization
passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  
  passport.deserializeUser(async(id, done) => {
    console.log("control inside the deserializeUser: ", id);
    
    if(!isValidObjectId(id)){
     return done({status: http.statusCode[401]});
    }
    let user = await User.findById(id,{password:0});
    return done(null, user);
  });
// }
