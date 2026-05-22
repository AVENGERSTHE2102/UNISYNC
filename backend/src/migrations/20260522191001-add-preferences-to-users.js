'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'calendarSyncPreferences', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });
    await queryInterface.addColumn('Users', 'jobAlertPreferences', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });
    await queryInterface.addColumn('Users', 'resumeUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'calendarSyncPreferences');
    await queryInterface.removeColumn('Users', 'jobAlertPreferences');
    await queryInterface.removeColumn('Users', 'resumeUrl');
  }
};
