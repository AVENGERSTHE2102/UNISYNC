const express = require('express');
const mentorshipController = require('../controllers/mentorshipController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All mentorship routes require authentication
router.use(requireAuth);

router.get('/', mentorshipController.getAllMentorships);
router.post('/', mentorshipController.createMentorship);
router.patch('/:id', mentorshipController.updateMentorshipStatus);
router.get('/mentors', mentorshipController.getPotentialMentors);

module.exports = router;
