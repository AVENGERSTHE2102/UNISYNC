module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('student', 'alumni', 'admin'),
        allowNull: false,
      },
      yearOfStudy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      professionalRole: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interests: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'Users',
    }
  );
