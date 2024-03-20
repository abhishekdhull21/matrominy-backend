const Payment = require("../models/Payment");

module.exports.savePayment = async (req, res, next) => {
  console.log("control inside the controller.savePayment()");
  const data = req.parameter?.data;
  try {
    if(!data?.screenshotUrl) throw({status:401, message:"Please provide a screenshot of payment..."})
    Payment.savePayment({ ...data, userID: req.user._id });
    return res.status(200).json({ success: true });
  } catch (err) {
    return next({status:err.status, message: err?.message || err });
  }
};
