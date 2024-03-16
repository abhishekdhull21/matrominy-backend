const Lead = require("../models/Leads");

module.exports.saveLead = async (req, res, next) => {
  console.log("control inside the lead.save()");
  const data = req.parameter?.data;
  try {
    Lead.saveLead({ ...data, userID: req.user._id });
    return res.status(200).json({ success: true });
  } catch (err) {
    return next({ message: err?.message || err });
  }
};
