// src/routes/mentorshipRoutes.js
const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all mentors
router.get('/', authMiddleware, mentorshipController.getAllMentors);

module.exports = router;