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
const connectionModel = require('./connection');
const eventRegistrationModel = require('./eventRegistration');
const savedJobModel = require('./savedJob');
const jobApplicationModel = require('./jobApplication');
const mentorshipGoalModel = require('./mentorshipGoal');

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
  db.Connection = connectionModel(sequelize, DataTypes);
  db.EventRegistration = eventRegistrationModel(sequelize, DataTypes);
  db.SavedJob = savedJobModel(sequelize, DataTypes);
  db.JobApplication = jobApplicationModel(sequelize, DataTypes);
  db.MentorshipGoal = mentorshipGoalModel(sequelize, DataTypes);

  db.Community.belongsTo(db.User, { as: 'creator', foreignKey: 'createdBy' });
  db.User.hasMany(db.Community, { as: 'communities', foreignKey: 'createdBy' });

  db.Community.belongsTo(db.ChatRoom, { foreignKey: 'chatRoomId', onDelete: 'SET NULL' });
  db.ChatRoom.hasOne(db.Community, { foreignKey: 'chatRoomId' });

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

  db.EventRegistration.belongsTo(db.User, { foreignKey: 'userId' });
  db.EventRegistration.belongsTo(db.Event, { foreignKey: 'eventId' });
  db.User.hasMany(db.EventRegistration, { foreignKey: 'userId' });
  db.Event.hasMany(db.EventRegistration, { foreignKey: 'eventId' });

  db.Job.belongsTo(db.User, { as: 'creator', foreignKey: 'createdBy' });
  db.User.hasMany(db.Job, { foreignKey: 'createdBy' });

  db.SavedJob.belongsTo(db.User, { foreignKey: 'userId' });
  db.SavedJob.belongsTo(db.Job, { foreignKey: 'jobId' });
  db.User.hasMany(db.SavedJob, { foreignKey: 'userId' });
  db.Job.hasMany(db.SavedJob, { foreignKey: 'jobId' });

  db.JobApplication.belongsTo(db.User, { foreignKey: 'userId' });
  db.JobApplication.belongsTo(db.Job, { foreignKey: 'jobId' });
  db.User.hasMany(db.JobApplication, { foreignKey: 'userId' });
  db.Job.hasMany(db.JobApplication, { foreignKey: 'jobId' });

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

  db.MentorshipGoal.belongsTo(db.User, { foreignKey: 'userId' });
  db.User.hasMany(db.MentorshipGoal, { foreignKey: 'userId' });

  // Connection Associations
  db.Connection.belongsTo(db.User, { as: 'requester', foreignKey: 'requesterId', onDelete: 'CASCADE' });
  db.Connection.belongsTo(db.User, { as: 'receiver', foreignKey: 'receiverId', onDelete: 'CASCADE' });
  db.User.hasMany(db.Connection, { as: 'sentRequests', foreignKey: 'requesterId' });
  db.User.hasMany(db.Connection, { as: 'receivedRequests', foreignKey: 'receiverId' });

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
