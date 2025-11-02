const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/', communityController.getAllCommunities);
router.post('/', communityController.createCommunity);

module.exports = router;
