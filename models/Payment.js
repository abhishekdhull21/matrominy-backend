const mongoose  = require("mongoose");
const commonSchema = require("./common");

const schema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who made the payment
    amount: { type: Number }, // Amount of the payment
    screenshotUrl: { type: String, required: true }, // URL or path to the payment info screenshot
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, // Status of payment approval
    remark:{String}
});


schema.add(commonSchema);

schema.statics.savePayment = function(paymentInfo){
    const payment = new this(paymentInfo);
    return payment.save();
}

const Payment = mongoose.model('payment', schema);

module.exports = Payment;