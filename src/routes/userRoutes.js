// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Create the special '/me' route
router.get('/me', authMiddleware, userController.getMe);

module.exports = router;