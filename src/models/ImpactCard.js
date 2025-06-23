const mongoose = require('mongoose');

const impactCardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  detailedDescription: { type: String, required: true }
});

const ImpactCard = mongoose.model('ImpactCard', impactCardSchema);

module.exports = { ImpactCard }; 