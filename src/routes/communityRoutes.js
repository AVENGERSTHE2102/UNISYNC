const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', communityController.getAllCommunities);
router.post('/', authMiddleware.protect, roleMiddleware(['admin']), communityController.createCommunity);

module.exports = router;
