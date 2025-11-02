// src/controllers/jobController.js
const { Job } = require('../models');

// Get all jobs
exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      order: [['deadline', 'ASC']], // Order by deadline
    });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};