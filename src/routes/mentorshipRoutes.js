const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');

router.get('/', mentorshipController.getAllMentorships);
router.post('/', mentorshipController.createMentorship);

module.exports = router;
