// src/routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all communities
router.get('/', authMiddleware, communityController.getAllCommunities);

// Route to get all threads
router.get('/threads', authMiddleware, communityController.getAllThreads);

module.exports = router;