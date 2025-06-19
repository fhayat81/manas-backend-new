const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  quote: { type: String, required: true },
  author: { type: String, required: true },
  location: { type: String, required: true }
});

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);

module.exports = { SuccessStory }; 