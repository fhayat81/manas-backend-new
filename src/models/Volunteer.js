const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  why: { type: String, required: true },
  areas: [{ type: String }],
  areaOther: { type: String },
  availability: { type: String, required: true },
  experience: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema); 