const express = require('express');
const { userNoAuthRouter, userRouter } = require('./user');
const { isAuthenticated } = require('./auth');
const { leadRouter } = require('./lead');
const { paymentRouter } = require('./payment');
const router = express.Router();




// Public Routes
router.use('/users', userNoAuthRouter);

// Auth Routes
router.use('/users', isAuthenticated, userRouter);
router.use('/leads', isAuthenticated, leadRouter);
router.use('/payments', isAuthenticated, paymentRouter);

router.get('/', (req, res, next) => {
    console.log("Control inside /")
    res.status(200).json({ message: 'done' })
});
 

module.exports =  router;