const express = require('express');
const threadController = require('../controllers/threadController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { communityIdValidators } = require('../validators/communityValidators');
const { createThreadValidators } = require('../validators/threadValidators');

const router = express.Router({ mergeParams: true });

router.get('/', validate(communityIdValidators), threadController.getAllThreads);
router.post(
  '/',
  requireAuth,
  validate([...communityIdValidators, ...createThreadValidators]),
  threadController.createThread
);

module.exports = router;
