const mongoose = require('mongoose');

const mediaCardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  source: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String, required: true }
});

const MediaCard = mongoose.model('MediaCard', mediaCardSchema);

module.exports = { MediaCard }; 