const db = require('../models');
const Event = db.Event;

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error getting events', error });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, date, description, eventType } = req.body;
    const event = await Event.create({ title, date, description, eventType });
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};
