const express = require('express');
const { savePayment } = require('../controller/paymentController');


const paymentRouter = express.Router();


// Private Auth Route
paymentRouter.post('/',savePayment);


module.exports = { paymentRouter }; 
