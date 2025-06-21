const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// POST /api/volunteer
router.post('/', volunteerController.createVolunteer);

// GET /api/volunteer (admin only)
router.get('/', volunteerController.getVolunteers);

module.exports = router; 