function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createMessageRepository(models) {
  const { Message, User } = models;

  return {
    async create({ roomId, senderId, content }) {
      const message = await Message.create({ roomId, senderId, content });
      // Fetch the created message with sender information
      const fullMessage = await Message.findByPk(message.id, {
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name'],
          },
        ],
      });
      return toPlain(fullMessage);
    },

    async listByRoom(roomId, { limit = 50, offset = 0 } = {}) {
      const result = await Message.findAndCountAll({
        where: { roomId },
        limit,
        offset,
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name'],
          },
        ],
      });

      return {
        count: result.count,
        rows: result.rows.map(toPlain),
      };
    },
  };
}

module.exports = {
  createMessageRepository,
};
