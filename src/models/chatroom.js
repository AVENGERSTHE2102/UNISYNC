'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatRoom extends Model {
    static associate(models) {
      ChatRoom.belongsToMany(models.User, { through: 'ChatRoomParticipant', foreignKey: 'roomId' });
      ChatRoom.hasMany(models.Message, { foreignKey: 'roomId' });
    }
  }

  ChatRoom.init({
    name: DataTypes.STRING,
    isGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'ChatRoom',
  });

  return ChatRoom;
};