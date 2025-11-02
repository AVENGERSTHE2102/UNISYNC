// src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// We add authMiddleware to make sure only logged-in users can see events
router.get('/', authMiddleware, eventController.getAllEvents);

module.exports = router;