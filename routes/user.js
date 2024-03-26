const express = require('express');
const passport = require('passport');


const { register, getUsers, viewProfile, updateProfile, favoriteProfile, getFavoriteProfile, getFavoriteProfileCount, getCount, getProfiles } = require('../controller/users');
const userRouter = express.Router();
const userNoAuthRouter = express.Router();

// Public Auth Route
userNoAuthRouter.post(
  "/login",
  passport.authenticate("local"),
  (req, res, next) => {
    console.log("user: ",req?.cookies)
    res.setHeader('c-cookie',req?.cookies['connect.sid'])
    return res.json({ success: true });
  }
);
userNoAuthRouter.post('/signup',register);
// userNoAuthRouter.get('/', viewProfile);

// Private Auth Route
userRouter.get('/count/of',getCount);
userRouter.post('/favorite',favoriteProfile);
userRouter.get('/favorite/all',getFavoriteProfile);
userRouter.get('/profile/:id',viewProfile);
userRouter.get('/profile',viewProfile);
userRouter.get('/profiles',getProfiles);
userRouter.put('/profile/:id',updateProfile);
userRouter.put('/profile',updateProfile);

// userNoAuthRouter.get('/:id', getUsers);
module.exports = { userRouter, userNoAuthRouter }; 
