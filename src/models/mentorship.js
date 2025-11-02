module.exports = (sequelize, DataTypes) => {
  const Mentorship = sequelize.define('Mentorship', {
    mentorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return Mentorship;
};
