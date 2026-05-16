module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define('Community', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Community;
};
