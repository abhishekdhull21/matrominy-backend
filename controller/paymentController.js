const Payment = require("../models/Payment");
const User = require("../models/User");

module.exports.savePayment = async (req, res, next) => {
  console.log("control inside the controller.savePayment()");
  const data = req.parameter?.data;
  try {
    if (!data?.screenshotUrl)
      throw {
        status: 401,
        message: "Please provide a screenshot of payment...",
      };
    Payment.savePayment({ ...data, userID: req.user._id });
    return res.status(200).json({ success: true });
  } catch (err) {
    return next({ status: err.status, message: err?.message || err });
  }
};

module.exports.getAllPayments = async (req, res, next) => {
  console.log("control inside the controller.getAllPayments()");
  const data = req.parameter?.data;
  try {
    const payments = await Payment.find({})
      .populate({
        path: "userID",
        select: "name dob gender isActive createdAt",
      })
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: payments });
  } catch (err) {
    return next({ status: err.status, message: err?.message || err });
  }
};

module.exports.approvePayment = async (req, res, next) => {
  console.log("control inside the controller.approvePayment()");
  const id = req.parameter?.id;
  const status = req.parameter?.status;
  try {
    const payments = await Payment.findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { new: true, upsert: false }
    );
    if (status === "Approved") {
      await User.updateProfile(payments?.userID, { role: "Pro" });
    }
    return res.status(200).json({ success: true, data: payments });
  } catch (err) {
    return next({ status: err.status, message: err?.message || err });
  }
};
