const express = require('express');
const { savePayment, getAllPayments, approvePayment } = require('../controller/paymentController');


const paymentRouter = express.Router();


// Private Auth Route
paymentRouter.post('/',savePayment);
paymentRouter.post('/approve',approvePayment);

paymentRouter.get('/',getAllPayments);


module.exports = { paymentRouter }; 
