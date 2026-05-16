'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatRoomParticipant extends Model {
    static associate(models) {
      // No need to define associations here for a simple join table
    }
  }

  ChatRoomParticipant.init({
    roomId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ChatRoomParticipant',
  });

  return ChatRoomParticipant;
};