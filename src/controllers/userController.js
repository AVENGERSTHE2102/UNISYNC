// src/controllers/userController.js
const { User } = require('../models');

// Get the profile for the currently logged-in user
exports.getMe = async (req, res, next) => {
  try {
    // req.user.id is provided by the authMiddleware
    const user = await User.findByPk(req.user.id, {
      // Exclude the password from the data we send back
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};