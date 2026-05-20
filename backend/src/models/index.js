const { DataTypes } = require('sequelize');
const userModel = require('./user');
const communityModel = require('./community');
const membershipModel = require('./membership');
const threadModel = require('./thread');
const replyModel = require('./reply');
const eventModel = require('./event');
const jobModel = require('./job');
const chatRoomModel = require('./chatRoom');
const chatRoomParticipantModel = require('./chatRoomParticipant');
const messageModel = require('./message');
const mentorshipModel = require('./mentorship');
const resourceModel = require('./resource');

function initModels(sequelize) {
  const db = {};

  db.sequelize = sequelize;
  db.User = userModel(sequelize, DataTypes);
  db.Community = communityModel(sequelize, DataTypes);
  db.Membership = membershipModel(sequelize, DataTypes);
  db.Thread = threadModel(sequelize, DataTypes);
  db.Reply = replyModel(sequelize, DataTypes);
  db.Event = eventModel(sequelize, DataTypes);
  db.Job = jobModel(sequelize, DataTypes);
  db.ChatRoom = chatRoomModel(sequelize, DataTypes);
  db.ChatRoomParticipant = chatRoomParticipantModel(sequelize, DataTypes);
  db.Message = messageModel(sequelize, DataTypes);
  db.Mentorship = mentorshipModel(sequelize, DataTypes);
  db.Resource = resourceModel(sequelize, DataTypes);

  db.Community.belongsTo(db.User, { as: 'creator', foreignKey: 'createdBy' });
  db.User.hasMany(db.Community, { as: 'communities', foreignKey: 'createdBy' });

  db.Membership.belongsTo(db.User, { foreignKey: 'userId' });
  db.Membership.belongsTo(db.Community, { foreignKey: 'communityId' });
  db.User.hasMany(db.Membership, { foreignKey: 'userId' });
  db.Community.hasMany(db.Membership, { foreignKey: 'communityId' });

  db.Thread.belongsTo(db.User, { as: 'author', foreignKey: 'authorId' });
  db.Thread.belongsTo(db.Community, { foreignKey: 'communityId' });
  db.User.hasMany(db.Thread, { foreignKey: 'authorId' });
  db.Community.hasMany(db.Thread, { foreignKey: 'communityId' });

  db.Reply.belongsTo(db.User, { as: 'author', foreignKey: 'authorId' });
  db.Reply.belongsTo(db.Thread, { foreignKey: 'threadId' });
  db.User.hasMany(db.Reply, { foreignKey: 'authorId' });
  db.Thread.hasMany(db.Reply, { foreignKey: 'threadId' });

  db.Event.belongsTo(db.User, { as: 'organizer', foreignKey: 'organizerId' });
  db.User.hasMany(db.Event, { foreignKey: 'organizerId' });

  db.Job.belongsTo(db.User, { as: 'creator', foreignKey: 'createdBy' });
  db.User.hasMany(db.Job, { foreignKey: 'createdBy' });

  // Chat Room Associations
  db.ChatRoom.hasMany(db.ChatRoomParticipant, { foreignKey: 'roomId', onDelete: 'CASCADE' });
  db.ChatRoomParticipant.belongsTo(db.ChatRoom, { foreignKey: 'roomId' });

  db.User.hasMany(db.ChatRoomParticipant, { foreignKey: 'userId', onDelete: 'CASCADE' });
  db.ChatRoomParticipant.belongsTo(db.User, { foreignKey: 'userId' });

  db.ChatRoom.belongsToMany(db.User, { through: db.ChatRoomParticipant, foreignKey: 'roomId', otherKey: 'userId', as: 'participants' });
  db.User.belongsToMany(db.ChatRoom, { through: db.ChatRoomParticipant, foreignKey: 'userId', otherKey: 'roomId', as: 'chatRooms' });

  db.Message.belongsTo(db.ChatRoom, { foreignKey: 'roomId', onDelete: 'CASCADE' });
  db.ChatRoom.hasMany(db.Message, { foreignKey: 'roomId' });

  db.Message.belongsTo(db.User, { as: 'sender', foreignKey: 'senderId', onDelete: 'CASCADE' });
  db.User.hasMany(db.Message, { foreignKey: 'senderId' });

  // Mentorship Associations
  db.Mentorship.belongsTo(db.User, { as: 'student', foreignKey: 'studentId', onDelete: 'CASCADE' });
  db.Mentorship.belongsTo(db.User, { as: 'mentor', foreignKey: 'mentorId', onDelete: 'CASCADE' });
  db.User.hasMany(db.Mentorship, { as: 'studentMentorships', foreignKey: 'studentId' });
  db.User.hasMany(db.Mentorship, { as: 'mentorMentorships', foreignKey: 'mentorId' });

  // Resource Associations
  db.Resource.belongsTo(db.User, { as: 'uploader', foreignKey: 'uploadedBy', onDelete: 'CASCADE' });
  db.Resource.belongsTo(db.Community, { foreignKey: 'communityId', onDelete: 'CASCADE' });
  db.User.hasMany(db.Resource, { foreignKey: 'uploadedBy' });
  db.Community.hasMany(db.Resource, { foreignKey: 'communityId' });

  return db;
}

module.exports = {
  initModels,
};
