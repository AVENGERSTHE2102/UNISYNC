// src/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect the route with authMiddleware
router.get('/', authMiddleware, jobController.getAllJobs);

module.exports = router;