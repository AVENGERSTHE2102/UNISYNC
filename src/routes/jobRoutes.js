const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', jobController.getAllJobs);
router.post('/', authMiddleware.protect, roleMiddleware(['admin']), jobController.createJob);

module.exports = router;
