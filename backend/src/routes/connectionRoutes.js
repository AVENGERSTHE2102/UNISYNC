const express = require('express');
const connectionController = require('../controllers/connectionController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/', connectionController.sendRequest);
router.get('/', connectionController.listConnections);
router.patch('/:id', connectionController.updateConnectionStatus);

module.exports = router;
