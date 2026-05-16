module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return Reply;
};
