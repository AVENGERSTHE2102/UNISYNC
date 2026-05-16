const db = require('../models');
const Mentorship = db.Mentorship;

exports.getAllMentorships = async (req, res) => {
  try {
    const mentorships = await Mentorship.findAll();
    res.status(200).json(mentorships);
  } catch (error) {
    res.status(500).json({ message: 'Error getting mentorships', error });
  }
};

exports.createMentorship = async (req, res) => {
  try {
    const { mentorName, expertise, bio } = req.body;
    const mentorship = await Mentorship.create({ mentorName, expertise, bio });
    res.status(201).json({ message: 'Mentorship created successfully', mentorship });
  } catch (error) {
    res.status(500).json({ message: 'Error creating mentorship', error });
  }
};
