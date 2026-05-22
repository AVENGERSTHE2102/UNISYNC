function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createChatRoomRepository(models) {
  const { ChatRoom, ChatRoomParticipant, User, Message } = models;

  return {
    async findById(roomId) {
      const room = await ChatRoom.findByPk(roomId, {
        include: [
          {
            model: User,
            as: 'participants',
            attributes: ['id', 'name', 'email', 'role'],
            through: { attributes: [] },
          },
        ],
      });
      return toPlain(room);
    },

    async listUserRooms(userId) {
      // Find rooms where the user is a participant
      const memberships = await ChatRoomParticipant.findAll({
        where: { userId },
        attributes: ['roomId'],
      });
      const roomIds = memberships.map((m) => m.roomId);
      if (roomIds.length === 0) return [];

      const rooms = await ChatRoom.findAll({
        where: { id: roomIds },
        include: [
          {
            model: User,
            as: 'participants',
            attributes: ['id', 'name', 'email', 'role'],
            through: { attributes: [] },
          },
        ],
      });

      const roomsPlain = rooms.map(toPlain);

      // Fetch the last message and unread count for each room
      for (const room of roomsPlain) {
        const lastMsg = await Message.findOne({
          where: { roomId: room.id },
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'name'],
            },
          ],
        });
        room.lastMessage = toPlain(lastMsg);

        // Find the user's participant record to check lastReadAt
        const myMembership = await ChatRoomParticipant.findOne({
          where: { roomId: room.id, userId },
        });

        if (myMembership) {
          const unreadCount = await Message.count({
            where: {
              roomId: room.id,
              senderId: { [Message.sequelize.Sequelize.Op.ne]: userId },
              createdAt: { [Message.sequelize.Sequelize.Op.gt]: myMembership.lastReadAt || new Date(0) }
            }
          });
          room.unreadCount = unreadCount;
        } else {
          room.unreadCount = 0;
        }
      }

      return roomsPlain;
    },

    async hasMember(roomId, userId) {
      const participant = await ChatRoomParticipant.findOne({
        where: { roomId, userId },
      });
      return !!participant;
    },

    async createRoom({ name, isGroup = false, participantIds }) {
      const transaction = await ChatRoom.sequelize.transaction();
      try {
        const room = await ChatRoom.create({ name, isGroup }, { transaction });
        const participants = participantIds.map((userId) => ({
          roomId: room.id,
          userId,
        }));
        await ChatRoomParticipant.bulkCreate(participants, { transaction });
        await transaction.commit();

        return await this.findById(room.id);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },

    async findDirectRoom(userId1, userId2) {
      const results = await ChatRoom.sequelize.query(
        `
        SELECT "roomId" FROM "ChatRoomParticipants"
        WHERE "userId" IN (:userId1, :userId2)
        GROUP BY "roomId"
        HAVING COUNT(DISTINCT "userId") = 2
        `,
        {
          replacements: { userId1, userId2 },
          type: ChatRoom.sequelize.QueryTypes.SELECT,
        }
      );

      if (results.length > 0) {
        const roomIds = results.map((r) => r.roomId);
        const room = await ChatRoom.findOne({
          where: {
            id: roomIds,
            isGroup: false,
          },
          include: [
            {
              model: User,
              as: 'participants',
              attributes: ['id', 'name', 'email', 'role'],
              through: { attributes: [] },
            },
          ],
        });
        return toPlain(room);
      }

      return null;
    },

    async addParticipant(roomId, userId) {
      const existing = await ChatRoomParticipant.findOne({ where: { roomId, userId } });
      if (!existing) {
        await ChatRoomParticipant.create({ roomId, userId });
      }
    },

    async removeParticipant(roomId, userId) {
      await ChatRoomParticipant.destroy({ where: { roomId, userId } });
    },

    async markAsRead(roomId, userId) {
      await ChatRoomParticipant.update(
        { lastReadAt: new Date() },
        { where: { roomId, userId } }
      );
    },
  };
}

module.exports = {
  createChatRoomRepository,
};
