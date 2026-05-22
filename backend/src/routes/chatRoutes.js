const express = require('express');
const chatController = require('../controllers/chatController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/rooms', chatController.listRooms);
router.post('/rooms', chatController.createRoom);
router.get('/rooms/:roomId/messages', chatController.getMessages);
router.post('/rooms/:roomId/read', chatController.markRoomAsRead);

module.exports = router;
