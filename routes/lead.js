const express = require('express');
const { saveLead } = require('../controller/leadController');


const leadRouter = express.Router();


// Private Auth Route
leadRouter.post('/save',saveLead);


module.exports = { leadRouter }; 
