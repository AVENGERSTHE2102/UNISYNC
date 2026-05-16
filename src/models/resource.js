'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    static associate(models) {
      Resource.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
    }
  }

  Resource.init({
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
    tags: DataTypes.TEXT, // Stored as comma-separated string
  }, {
    sequelize,
    modelName: 'Resource',
  });

  return Resource;
};