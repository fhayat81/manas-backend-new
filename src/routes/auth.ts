import express from 'express';
import { register, login, verifyOTP, resendOTP } from '../controllers/authController';
import { validateRegistration, validateLogin, validateOTP } from '../validations/auth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/verify-otp', validateOTP, verifyOTP);
router.post('/resend-otp', resendOTP);

export default router; 