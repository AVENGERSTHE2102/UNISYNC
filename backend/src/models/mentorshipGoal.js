module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'MentorshipGoal',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      targetDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      actionPlan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'In Progress',
      },
    },
    {
      tableName: 'MentorshipGoals',
    }
  );
