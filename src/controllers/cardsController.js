const { ImpactCard } = require('../models/ImpactCard');
const { AchievementCard } = require('../models/AchievementCard');
const { SuccessStory } = require('../models/SuccessStory');
const { MediaCard } = require('../models/MediaCard');

// Get all Impact Cards
const getImpactCards = async (req, res) => {
  try {
    const cards = await ImpactCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch impact cards' });
  }
};

// Get all Achievement Cards
const getAchievementCards = async (req, res) => {
  try {
    const cards = await AchievementCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch achievement cards' });
  }
};

// Get all Success Stories
const getSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch success stories' });
  }
};

// Get all Media Cards
const getMediaCards = async (req, res) => {
  try {
    const cards = await MediaCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch media cards' });
  }
};

module.exports = {
  getImpactCards,
  getAchievementCards,
  getSuccessStories,
  getMediaCards
}; 