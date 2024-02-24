const mongoose = require('mongoose');

const commonSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Middleware to update `updatedAt` on every save
commonSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

commonSchema.pre('update', function (next) {
  this.updatedAt = new Date();
  next();
});
commonSchema.pre('updateOne', function (next) {
  this.updatedAt = new Date();
  next();
});

commonSchema.pre('updateMany', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = commonSchema;
