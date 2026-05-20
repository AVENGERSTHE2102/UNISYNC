module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Membership',
    {
      communityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: 'Memberships',
    }
  );
