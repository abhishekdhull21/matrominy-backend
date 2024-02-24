const express = require('express');
const passport = require('passport');


const { register, getUsers } = require('../controller/users');
const userRouter = express.Router();
const userNoAuthRouter = express.Router();

// Public Auth Route
userNoAuthRouter.post('/login', passport.authenticate('local'),(req,res,next) => { res.json({success:true})});
userNoAuthRouter.post('/signup',register);
userNoAuthRouter.get('/', getUsers);
userNoAuthRouter.get('/:id', getUsers);

// Private Auth Route

module.exports = { userRouter, userNoAuthRouter }; 
