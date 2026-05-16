'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      // No need to define associations here for a simple join table
    }
  }

  Membership.init({
    communityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Membership',
  });

  return Membership;
};