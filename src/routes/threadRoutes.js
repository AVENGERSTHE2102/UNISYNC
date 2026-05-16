const express = require('express');
const router = express.Router({ mergeParams: true });
const threadController = require('../controllers/threadController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', threadController.getAllThreads);
router.post('/', protect, threadController.createThread);

module.exports = router;
