const db = require('../models');
const Job = db.Job;

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error getting jobs', error });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, jobType } = req.body;
    const job = await Job.create({ title, company, location, description, jobType });
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
};
