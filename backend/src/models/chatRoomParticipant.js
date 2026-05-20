module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'ChatRoomParticipant',
    {
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'ChatRooms',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'ChatRoomParticipants',
    }
  );
