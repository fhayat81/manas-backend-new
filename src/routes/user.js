const express = require('express');
const { getProfile, updateProfile, updateProfilePicture, getAllProfiles, getProfileById } = require('../controllers/userController.js');
const { authenticate } = require('../middleware/auth.js');
const { validateProfileUpdate } = require('../validations/auth.js');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.get('/profiles', authenticate, getAllProfiles);
router.get('/profile/:id', authenticate, getProfileById);
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);
router.post('/profile/photo', authenticate, updateProfilePicture);

module.exports = router;
