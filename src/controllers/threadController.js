const db = require('../models');
const Thread = db.Thread;

exports.getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.findAll({ where: { communityId: req.params.communityId } });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Error getting threads', error });
  }
};

exports.createThread = async (req, res) => {
  try {
    const { title, content } = req.body;
    const thread = await Thread.create({ title, content, communityId: req.params.communityId, userId: req.user.id });
    res.status(201).json({ message: 'Thread created successfully', thread });
  } catch (error) {
    res.status(500).json({ message: 'Error creating thread', error });
  }
};
