const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const { ImpactCard } = require('../models/ImpactCard.js');
const { AchievementCard } = require('../models/AchievementCard.js');
const { SuccessStory } = require('../models/SuccessStory.js');
const { MediaCard } = require('../models/MediaCard.js');
const { AdminUser } = require('../models/AdminUser.js');
const { Event } = require('../models/Event.js');

const ADMIN_EMAIL = 'manasfoundation2025@gmail.com';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const otpStore = {};

const createTransporter = async () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

exports.sendAdminOTP = async (req, res) => {
  const { email } = req.body;
  let allowed = false;
  if (email === ADMIN_EMAIL) {
    allowed = true;
  } else {
    const admin = await AdminUser.findOne({ email });
    if (admin) allowed = true;
  }
  if (!allowed) {
    return res.status(403).json({ message: 'Unauthorized email' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + OTP_EXPIRY_MS };
  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your Admin OTP',
      html: `<h2>Your OTP is: <span style="color:#4F46E5">${otp}</span></h2><p>This OTP is valid for 10 minutes.</p>`
    });
    res.json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending admin OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyAdminOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record || record.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }
  delete otpStore[email];

  let admin = await AdminUser.findOne({ email });
  if (!admin && email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Admin not found' });
  }

  // If admin is not in DB but matches ADMIN_EMAIL, create a dummy admin object for token
  if (!admin && email === ADMIN_EMAIL) {
    admin = { _id: 'hardcoded-admin', email: ADMIN_EMAIL };
  }

  // Generate JWT token with 5-hour expiry, including userId
  const token = jwt.sign(
    {
      userId: admin._id,
      email: email,
      role: 'admin',
      isAdmin: true
    },
    process.env.JWT_SECRET || '31b63c0000e0210e7b9048708d9f7c57809b220cf54195c02e75f599007a6ffd7face7681d9b927fc70964aac9fa2dc5c5227d153e063e7a264ca10107e702d6',
    { expiresIn: '5h' }
  );

  res.json({
    message: 'OTP verified',
    token: token,
    expiresIn: '5h'
  });
};

// ===== USER MANAGEMENT =====
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { full_name, email, age, gender, marital_status, education, profession, phone_number, interests_hobbies, brief_personal_description, location, children_count, is_verified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        full_name,
        email,
        age,
        gender,
        marital_status,
        education,
        profession,
        phone_number,
        interests_hobbies,
        brief_personal_description,
        location,
        children_count,
        is_verified
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// ===== IMPACT CARDS MANAGEMENT =====
exports.getAllImpactCards = async (req, res) => {
  try {
    const cards = await ImpactCard.find({}).sort({ id: 1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching impact cards:', error);
    res.status(500).json({ message: 'Failed to fetch impact cards' });
  }
};

exports.createImpactCard = async (req, res) => {
  try {
    const { title, description, imageUrl, link, detailedDescription } = req.body;
    
    // Get the next available ID
    const lastCard = await ImpactCard.findOne().sort({ id: -1 });
    const nextId = lastCard ? lastCard.id + 1 : 1;
    
    const card = new ImpactCard({
      id: nextId,
      title,
      description,
      imageUrl,
      link,
      detailedDescription
    });
    
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating impact card:', error);
    res.status(500).json({ message: 'Failed to create impact card' });
  }
};

exports.updateImpactCard = async (req, res) => {
  try {
    const { title, description, imageUrl, link, detailedDescription } = req.body;
    
    const card = await ImpactCard.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, link, detailedDescription },
      { new: true }
    );
    
    if (!card) {
      return res.status(404).json({ message: 'Impact card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error updating impact card:', error);
    res.status(500).json({ message: 'Failed to update impact card' });
  }
};

exports.deleteImpactCard = async (req, res) => {
  try {
    const card = await ImpactCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Impact card not found' });
    }
    res.json({ message: 'Impact card deleted successfully' });
  } catch (error) {
    console.error('Error deleting impact card:', error);
    res.status(500).json({ message: 'Failed to delete impact card' });
  }
};

// ===== ACHIEVEMENT CARDS MANAGEMENT =====
exports.getAllAchievementCards = async (req, res) => {
  try {
    const cards = await AchievementCard.find({}).sort({ id: 1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching achievement cards:', error);
    res.status(500).json({ message: 'Failed to fetch achievement cards' });
  }
};

exports.createAchievementCard = async (req, res) => {
  try {
    const { icon, number, title, description } = req.body;
    
    // Get the next available ID
    const lastCard = await AchievementCard.findOne().sort({ id: -1 });
    const nextId = lastCard ? lastCard.id + 1 : 1;
    
    const card = new AchievementCard({
      id: nextId,
      icon,
      number,
      title,
      description
    });
    
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating achievement card:', error);
    res.status(500).json({ message: 'Failed to create achievement card' });
  }
};

exports.updateAchievementCard = async (req, res) => {
  try {
    const { icon, number, title, description } = req.body;
    
    const card = await AchievementCard.findByIdAndUpdate(
      req.params.id,
      { icon, number, title, description },
      { new: true }
    );
    
    if (!card) {
      return res.status(404).json({ message: 'Achievement card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error updating achievement card:', error);
    res.status(500).json({ message: 'Failed to update achievement card' });
  }
};

exports.deleteAchievementCard = async (req, res) => {
  try {
    const card = await AchievementCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Achievement card not found' });
    }
    res.json({ message: 'Achievement card deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement card:', error);
    res.status(500).json({ message: 'Failed to delete achievement card' });
  }
};

// ===== SUCCESS STORIES MANAGEMENT =====
exports.getAllSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({}).sort({ id: 1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ message: 'Failed to fetch success stories' });
  }
};

exports.createSuccessStory = async (req, res) => {
  try {
    const { quote, author, location } = req.body;
    
    // Get the next available ID
    const lastStory = await SuccessStory.findOne().sort({ id: -1 });
    const nextId = lastStory ? lastStory.id + 1 : 1;
    
    const story = new SuccessStory({
      id: nextId,
      quote,
      author,
      location
    });
    
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating success story:', error);
    res.status(500).json({ message: 'Failed to create success story' });
  }
};

exports.updateSuccessStory = async (req, res) => {
  try {
    const { quote, author, location } = req.body;
    
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { quote, author, location },
      { new: true }
    );
    
    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Error updating success story:', error);
    res.status(500).json({ message: 'Failed to update success story' });
  }
};

exports.deleteSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }
    res.json({ message: 'Success story deleted successfully' });
  } catch (error) {
    console.error('Error deleting success story:', error);
    res.status(500).json({ message: 'Failed to delete success story' });
  }
};

// ===== MEDIA CARDS MANAGEMENT =====
exports.getAllMediaCards = async (req, res) => {
  try {
    const cards = await MediaCard.find({}).sort({ id: 1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching media cards:', error);
    res.status(500).json({ message: 'Failed to fetch media cards' });
  }
};

exports.createMediaCard = async (req, res) => {
  try {
    const { title, date, source, description, imageUrl, detailedDescription } = req.body;
    
    // Get the next available ID
    const lastCard = await MediaCard.findOne().sort({ id: -1 });
    const nextId = lastCard ? lastCard.id + 1 : 1;
    
    const card = new MediaCard({
      id: nextId,
      title,
      date,
      source,
      description,
      imageUrl,
      detailedDescription
    });
    
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating media card:', error);
    res.status(500).json({ message: 'Failed to create media card' });
  }
};

exports.updateMediaCard = async (req, res) => {
  try {
    const { title, date, source, description, imageUrl, detailedDescription } = req.body;
    
    const card = await MediaCard.findByIdAndUpdate(
      req.params.id,
      { title, date, source, description, imageUrl, detailedDescription },
      { new: true }
    );
    
    if (!card) {
      return res.status(404).json({ message: 'Media card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error updating media card:', error);
    res.status(500).json({ message: 'Failed to update media card' });
  }
};

exports.deleteMediaCard = async (req, res) => {
  try {
    const card = await MediaCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Media card not found' });
    }
    res.json({ message: 'Media card deleted successfully' });
  } catch (error) {
    console.error('Error deleting media card:', error);
    res.status(500).json({ message: 'Failed to delete media card' });
  }
};

// ===== ADMIN USERS MANAGEMENT =====
exports.getAllAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Failed to fetch admin users' });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Admin user already exists' });
    const user = new AdminUser({ email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Failed to create admin user' });
  }
};

exports.updateAdminUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await AdminUser.findByIdAndUpdate(
      req.params.id,
      { email },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Admin user not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating admin user:', error);
    res.status(500).json({ message: 'Failed to update admin user' });
  }
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Admin user not found' });
    res.json({ message: 'Admin user deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({ message: 'Failed to delete admin user' });
  }
};

// ===== EVENTS MANAGEMENT =====
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, description, month, day, registerLink } = req.body;
    const event = new Event({ title, date, startTime, endTime, location, description, month, day, registerLink });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, description, month, day, registerLink } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, startTime, endTime, location, description, month, day, registerLink },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
}; 