module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Resource',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      communityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tags: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'Resources',
    }
  );
