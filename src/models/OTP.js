const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for automatic deletion of expired OTPs
otpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = { OTP };
