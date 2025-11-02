// src/controllers/communityController.js
const { Community, Thread, User } = require('../models');

// Get all communities
exports.getAllCommunities = async (req, res, next) => {
  try {
    const communities = await Community.findAll();
    res.status(200).json(communities);
  } catch (error) {
    next(error);
  }
};

// Get all threads
exports.getAllThreads = async (req, res, next) => {
  try {
    const threads = await Thread.findAll({
      order: [['createdAt', 'DESC']],
      include: {
        model: User,
        as: 'author', // This is from your Thread model
        attributes: ['name'] // Only get the author's name
      }
    });
    res.status(200).json(threads);
  } catch (error) {
    next(error);
  }
};