const db = require('../models');
const Community = db.Community;

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Error getting communities', error });
  }
};

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const community = await Community.create({ name, description, category });
    res.status(201).json({ message: 'Community created successfully', community });
  } catch (error) {
    res.status(500).json({ message: 'Error creating community', error });
  }
};
