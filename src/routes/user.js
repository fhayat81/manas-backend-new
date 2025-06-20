const express = require('express');
const { getProfile, updateProfile, updateProfilePicture, getAllProfiles, getProfileById, expressInterest, removeInterest, acceptInterest, rejectInterest } = require('../controllers/userController.js');
const { authenticate } = require('../middleware/auth.js');
const { validateProfileUpdate } = require('../validations/auth.js');
const cardsController = require('../controllers/cardsController.js');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.get('/profiles', authenticate, getAllProfiles);
router.get('/profile/:id', authenticate, getProfileById);
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);
router.put('/profile/picture', authenticate, updateProfilePicture);
router.post('/express-interest', authenticate, expressInterest);
router.post('/accept-interest', authenticate, acceptInterest);
router.post('/reject-interest', authenticate, rejectInterest);
router.delete('/remove-interest', authenticate, removeInterest);

// Public card data endpoints
router.get('/impact-cards', cardsController.getImpactCards);
router.get('/achievement-cards', cardsController.getAchievementCards);
router.get('/success-stories', cardsController.getSuccessStories);
router.get('/media-cards', cardsController.getMediaCards);

router.post('/contact', cardsController.contactFormHandler || require('../controllers/userController').contactFormHandler);

module.exports = router;
