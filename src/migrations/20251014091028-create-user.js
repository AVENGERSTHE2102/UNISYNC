'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM('student', 'alumni', 'expert', 'admin'),
        allowNull: false,
      },
      profilePicture: {
        type: Sequelize.TEXT
      },
      yearOfStudy: {
        type: Sequelize.INTEGER
      },
      branch: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      interests: {
        type: Sequelize.TEXT
      },
      skills: {
        type: Sequelize.TEXT
      },
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};