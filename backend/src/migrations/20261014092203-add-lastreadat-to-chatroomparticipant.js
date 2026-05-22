module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ChatRoomParticipants', 'lastReadAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ChatRoomParticipants', 'lastReadAt');
  },
};
