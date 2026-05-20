module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Mentorship',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      mentorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      compatibilityScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'active', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'Mentorships',
    }
  );
