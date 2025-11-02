const db = require('../models');
const Reply = db.Reply;

exports.getAllReplies = async (req, res) => {
  try {
    const replies = await Reply.findAll({ where: { threadId: req.params.threadId } });
    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({ message: 'Error getting replies', error });
  }
};

exports.createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const reply = await Reply.create({ content, threadId: req.params.threadId, userId: req.user.id });
    res.status(201).json({ message: 'Reply created successfully', reply });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reply', error });
  }
};
