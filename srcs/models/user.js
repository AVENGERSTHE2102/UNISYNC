module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER
    },
    branch: {
      type: DataTypes.STRING
    },
    company: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    interests: {
      type: DataTypes.JSON
    }
  });

  return User;
};
