// src/controllers/eventController.js
const { Event } = require('../models');

// Get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']], // Order by date
    });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// Add more functions here later, like createEvent, getEventById, etc.