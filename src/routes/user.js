const express = require('express');
const { getProfile, updateProfile, updateProfilePicture } = require('../controllers/userController.js');
const { authenticate } = require('../middleware/auth.js');
const { validateProfileUpdate } = require('../validations/auth.js');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);
router.post('/profile/photo', authenticate, updateProfilePicture);

module.exports = router;
