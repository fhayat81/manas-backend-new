import express from 'express';
import { getProfile, updateProfile, updateProfilePicture } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateProfileUpdate } from '../validations/auth';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);
router.post('/profile/photo', authenticate, updateProfilePicture);

export default router; 