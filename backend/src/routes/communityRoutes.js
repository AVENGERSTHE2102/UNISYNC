const express = require('express');
const communityController = require('../controllers/communityController');
const membershipController = require('../controllers/membershipController');
const resourceController = require('../controllers/resourceController');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { createCommunityValidators } = require('../validators/communityValidators');

const router = express.Router();

router.get('/', communityController.getAllCommunities);
router.post(
  '/',
  requireAuth,
  authorize('admin'),
  validate(createCommunityValidators),
  communityController.createCommunity
);

router.post('/:communityId/memberships', requireAuth, membershipController.joinCommunity);
router.delete('/:communityId/memberships', requireAuth, membershipController.leaveCommunity);

// Resource routes
router.post('/:communityId/resources', requireAuth, upload.single('file'), resourceController.uploadResource);
router.get('/:communityId/resources', requireAuth, resourceController.listResources);
router.get('/:communityId/resources/:resourceId/download', requireAuth, resourceController.downloadResource);

module.exports = router;
