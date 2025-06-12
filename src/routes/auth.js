const express = require('express');
const { register, login, verifyOTP, resendOTP } = require('../controllers/authController.js');
const { validateRegistration, validateLogin, validateOTP } = require('../validations/auth.js');
// const { authenticate } = require('../middleware/auth'); // Uncomment if needed

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/verify-otp', validateOTP, verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;
