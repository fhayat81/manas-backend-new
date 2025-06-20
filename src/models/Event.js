const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  startTime: String,
  endTime: String,
  location: String,
  description: String,
  month: String, // e.g., "JUN"
  day: String,   // e.g., "15"
  registerLink: String, // URL for registration
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event }; 