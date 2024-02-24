const express = require('express');
const { userNoAuthRouter, userRouter } = require('./user');
const { isAuthenticated } = require('./auth');
const router = express.Router();




// Public Routes
router.use('/users', userNoAuthRouter);

// Auth Routes
router.use('/users', isAuthenticated, userRouter);

router.get('/', (req, res, next) => {
    console.log("Control inside /")
    res.status(200).json({ message: 'done' })
});
 

module.exports =  router;