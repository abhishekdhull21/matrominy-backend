const express = require('express');
const passport = require('passport');


const { register, getUsers, viewProfile, updateProfile, favoriteProfile, getFavoriteProfile, getFavoriteProfileCount, getCount } = require('../controller/users');
const userRouter = express.Router();
const userNoAuthRouter = express.Router();

// Public Auth Route
userNoAuthRouter.post('/login', passport.authenticate('local'),(req,res,next) => { res.json({success:true})});
userNoAuthRouter.post('/signup',register);
// userNoAuthRouter.get('/', viewProfile);
userNoAuthRouter.get('/:id', getUsers);

// Private Auth Route
userRouter.get('/count/of',getCount);
userRouter.post('/favorite',favoriteProfile);
userRouter.get('/favorite/all',getFavoriteProfile);
userRouter.get('/profile/:id',viewProfile);
userRouter.put('/profile/:id',updateProfile);

module.exports = { userRouter, userNoAuthRouter }; 
