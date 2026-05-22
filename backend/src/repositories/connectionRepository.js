function createConnectionRepository({ Connection, User }) {
  return {
    async create(payload) {
      const conn = await Connection.create(payload);
      return conn.get({ plain: true });
    },
    async findById(id) {
      const conn = await Connection.findByPk(id, {
        include: [
          { model: User, as: 'requester', attributes: ['id', 'name', 'email', 'role'] },
          { model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'role'] }
        ]
      });
      return conn ? conn.get({ plain: true }) : null;
    },
    async findExisting(requesterId, receiverId) {
      const conn = await Connection.findOne({
        where: { requesterId, receiverId }
      });
      return conn ? conn.get({ plain: true }) : null;
    },
    async findAnyExisting(user1Id, user2Id) {
      const { Op } = require('sequelize');
      const conn = await Connection.findOne({
        where: {
          [Op.or]: [
            { requesterId: user1Id, receiverId: user2Id },
            { requesterId: user2Id, receiverId: user1Id }
          ]
        }
      });
      return conn ? conn.get({ plain: true }) : null;
    },
    async listUserConnections(userId) {
      const { Op } = require('sequelize');
      const connections = await Connection.findAll({
        where: {
          [Op.or]: [{ requesterId: userId }, { receiverId: userId }]
        },
        include: [
          { model: User, as: 'requester', attributes: ['id', 'name', 'email', 'role', 'professionalRole', 'branch'] },
          { model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'role', 'professionalRole', 'branch'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      return connections.map(c => c.get({ plain: true }));
    },
    async listAllAccepted() {
      const connections = await Connection.findAll({
        where: { status: 'accepted' },
        attributes: ['requesterId', 'receiverId']
      });
      return connections.map(c => c.get({ plain: true }));
    },
    async updateStatus(id, status) {
      await Connection.update({ status }, { where: { id } });
      return this.findById(id);
    }
  };
}

module.exports = {
  createConnectionRepository,
};
