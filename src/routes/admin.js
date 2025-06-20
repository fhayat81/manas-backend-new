const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { authenticate } = require('../middleware/auth.js');

// Admin authentication routes (no auth required)
router.post('/send-otp', adminController.sendAdminOTP);
router.post('/verify-otp', adminController.verifyAdminOTP);

// Protected admin routes (require JWT auth)
router.use(authenticate);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Impact Cards management
router.get('/impact-cards', adminController.getAllImpactCards);
router.post('/impact-cards', adminController.createImpactCard);
router.put('/impact-cards/:id', adminController.updateImpactCard);
router.delete('/impact-cards/:id', adminController.deleteImpactCard);

// Achievement Cards management
router.get('/achievement-cards', adminController.getAllAchievementCards);
router.post('/achievement-cards', adminController.createAchievementCard);
router.put('/achievement-cards/:id', adminController.updateAchievementCard);
router.delete('/achievement-cards/:id', adminController.deleteAchievementCard);

// Success Stories management
router.get('/success-stories', adminController.getAllSuccessStories);
router.post('/success-stories', adminController.createSuccessStory);
router.put('/success-stories/:id', adminController.updateSuccessStory);
router.delete('/success-stories/:id', adminController.deleteSuccessStory);

// Media Cards management
router.get('/media-cards', adminController.getAllMediaCards);
router.post('/media-cards', adminController.createMediaCard);
router.put('/media-cards/:id', adminController.updateMediaCard);
router.delete('/media-cards/:id', adminController.deleteMediaCard);

// Admin Users management
router.get('/admin-users', adminController.getAllAdminUsers);
router.post('/admin-users', adminController.createAdminUser);
router.put('/admin-users/:id', adminController.updateAdminUser);
router.delete('/admin-users/:id', adminController.deleteAdminUser);

// Events management
router.get('/events', adminController.getAllEvents);
router.post('/events', adminController.createEvent);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

module.exports = router; 