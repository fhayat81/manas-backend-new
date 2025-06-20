const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = { AdminUser }; 