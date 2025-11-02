// src/controllers/mentorshipController.js
const { User } = require('../models');
const { Op } = require('sequelize'); // Import Op for "OR" queries

// Get all mentors (alumni or experts)
exports.getAllMentors = async (req, res, next) => {
  try {
    const mentors = await User.findAll({
      where: {
        userType: {
          [Op.or]: ['alumni', 'expert']
        }
      },
      // We only send the fields that are safe to show
      attributes: ['id', 'name', 'profilePicture', 'company', 'role', 'skills', 'interests'] 
    });
    res.status(200).json(mentors);
  } catch (error) {
    next(error);
  }
};