const express = require('express');
const eventController = require('../controllers/eventController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { createEventValidators } = require('../validators/eventValidators');

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.post(
  '/',
  requireAuth,
  validate(createEventValidators),
  eventController.createEvent
);
router.get('/tickets', requireAuth, eventController.getMyTickets);
router.post('/:id/register', requireAuth, eventController.registerForEvent);

module.exports = router;
