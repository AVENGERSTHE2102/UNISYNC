const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', eventController.getAllEvents);
router.post('/', authMiddleware.protect, roleMiddleware(['admin']), eventController.createEvent);

module.exports = router;
