const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const { OTP } = require('../models/OTP.js');
const { sendOTPEmail } = require('../services/emailService.js');
const { registerSchema, loginSchema, verifyOTPSchema } = require('../validations/auth.js');

// Register new user
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      profile_photo,
      date_of_birth,
      gender,
      marital_status,
      education,
      profession,
      phone_number,
      interests_hobbies,
      brief_personal_description,
      location,
      guardian,
      caste,
      religion,
      divorce_finalized,
      children,
      children_count
    } = req.body;

    console.log('Registration attempt:', {
      email,
      date_of_birth,
      gender,
      marital_status,
      education,
      profession,
      phone_number,
      location,
      guardian,
      caste,
      religion,
      divorce_finalized,
      children,
      children_count
    });

    // Check if user already exists (only by email now)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      full_name,
      email,
      password: hashedPassword,
      profile_photo,
      date_of_birth: new Date(date_of_birth),
      gender,
      marital_status,
      education,
      profession,
      phone_number,
      interests_hobbies,
      brief_personal_description,
      location,
      guardian,
      caste,
      religion,
      divorce_finalized,
      children,
      children_count,
      is_verified: false
    });

    await user.save();
    console.log('User saved successfully:', user._id);

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otpDoc = new OTP({
      userId: user._id,
      otp,
      expiry: otpExpiry
    });

    await otpDoc.save();
    console.log('OTP saved successfully');
    
    try {
      await sendOTPEmail(email, otp);
      console.log('OTP email sent successfully');
      res.status(201).json({ 
        message: 'Registration successful. Please check your email for verification code.',
        userId: user._id,
        email: user.email
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Don't fail the registration if email fails - just log the error
      console.log('Registration successful but email service failed. User ID:', user._id);
      res.status(201).json({ 
        message: 'Registration successful! Please contact support for email verification.',
        userId: user._id,
        email: user.email,
        note: 'Email verification will be handled by support team'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    if (error.code === 11000) {
      // Duplicate key error
      // Assuming email is the only unique field now for user identification at registration
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username_or_email, password } = req.body;

    // Check if user exists (only by email now)
    const user = await User.findOne({
      email: username_or_email
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Remove username from payload
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        marital_status: user.marital_status,
        education: user.education,
        profession: user.profession,
        phone_number: user.phone_number,
        interests_hobbies: user.interests_hobbies,
        brief_personal_description: user.brief_personal_description,
        location: user.location,
        children_count: user.children_count,
        profile_photo: user.profile_photo,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otpDoc = await OTP.findOne({
      userId: user._id,
      otp: code,
      expiry: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update user verification status
    user.is_verified = true;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpDoc._id });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs
    await OTP.deleteMany({ userId: user._id });

    // Save new OTP
    const otpDoc = new OTP({
      userId: user._id,
      otp,
      expiry: otpExpiry
    });

    await otpDoc.save();
    await sendOTPEmail(email, otp);

    res.json({ message: 'New OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const { profile_photo } = req.body;
    const userId = req.user.userId;

    if (!profile_photo) {
      return res.status(400).json({ error: 'Profile photo is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profile_photo },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile_photo: user.profile_photo });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP,
  uploadProfilePicture
};
