const express = require('express');
const router = express.Router({ mergeParams: true });
const replyController = require('../controllers/replyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', replyController.getAllReplies);
router.post('/', protect, replyController.createReply);

module.exports = router;
