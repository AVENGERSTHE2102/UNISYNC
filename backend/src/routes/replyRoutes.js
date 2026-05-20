const express = require('express');
const replyController = require('../controllers/replyController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { threadIdValidators } = require('../validators/threadValidators');
const { createReplyValidators } = require('../validators/replyValidators');

const router = express.Router({ mergeParams: true });

router.get('/', validate(threadIdValidators), replyController.getAllReplies);
router.post(
  '/',
  requireAuth,
  validate([...threadIdValidators, ...createReplyValidators]),
  replyController.createReply
);

module.exports = router;
