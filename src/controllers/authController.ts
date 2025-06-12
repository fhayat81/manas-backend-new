import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { OTP } from '../models/OTP';
import { sendOTPEmail } from '../services/emailService';
import { registerSchema, loginSchema, verifyOTPSchema } from '../validations/auth';

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const {
      username,
      full_name,
      email,
      password,
      profile_photo,
      age,
      gender,
      marital_status,
      education,
      location,
      children_count
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 
          'Email already registered' : 
          'Username already taken' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      full_name,
      email,
      password: hashedPassword,
      profile_photo,
      age,
      gender,
      marital_status,
      education,
      location,
      children_count,
      is_verified: false
    });

    await user.save();

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otpDoc = new OTP({
      userId: user._id,
      otp,
      expiry: otpExpiry
    });

    await otpDoc.save();
    
    try {
      await sendOTPEmail(email, otp);
      res.status(201).json({ 
        message: 'Registration successful. Please check your email for verification code.',
        userId: user._id,
        email: user.email
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Still return success but with a different message
      res.status(201).json({ 
        message: 'Registration successful. Please contact support for email verification.',
        userId: user._id,
        email: user.email
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { username_or_email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({
      $or: [
        { email: username_or_email },
        { username: username_or_email }
      ]
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
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        marital_status: user.marital_status,
        education: user.education,
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
export const verifyOTP = async (req: Request, res: Response) => {
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
export const resendOTP = async (req: Request, res: Response) => {
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

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const { profile_photo } = req.body;
    const userId = (req as any).user.userId;

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