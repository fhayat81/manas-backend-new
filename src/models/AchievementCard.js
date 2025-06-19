const mongoose = require('mongoose');

const achievementCardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  icon: { type: String, required: true },
  number: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const AchievementCard = mongoose.model('AchievementCard', achievementCardSchema);

module.exports = { AchievementCard }; 