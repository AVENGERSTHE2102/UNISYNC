const { NotFoundError, AuthorizationError, ValidationError } = require('../utils/appError');
const { parsePagination } = require('../utils/pagination');

function createMessageService({ messageRepository, chatRoomRepository }) {
  return {
    async saveMessage({ roomId, senderId, content }) {
      if (!content || !content.trim()) {
        throw new ValidationError('Message content cannot be empty.');
      }
      if (content.length > 2000) {
        throw new ValidationError('Message content exceeds 2000 characters.');
      }

      // Verify membership
      const isMember = await chatRoomRepository.hasMember(roomId, senderId);
      if (!isMember) {
        throw new AuthorizationError('You are not a participant in this chat room.');
      }

      return messageRepository.create({ roomId, senderId, content });
    },

    async listMessages(roomId, userId, query) {
      const room = await chatRoomRepository.findById(roomId);
      if (!room) {
        throw new NotFoundError('Chat room not found.');
      }

      // Verify membership
      const isMember = await chatRoomRepository.hasMember(roomId, userId);
      if (!isMember) {
        throw new AuthorizationError('You do not have permission to view messages in this room.');
      }

      const pagination = parsePagination(query);
      const result = await messageRepository.listByRoom(roomId, pagination);

      return {
        items: result.rows,
        meta: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.count,
        },
      };
    },

    async createRoom(actorId, payload) {
      const { name, isGroup = false } = payload;
      let participantIds = payload.participantIds || [];

      // Ensure actor is in participant list
      if (!participantIds.includes(actorId)) {
        participantIds.push(actorId);
      }

      // Remove duplicates
      participantIds = [...new Set(participantIds)];

      if (participantIds.length < 2) {
        throw new ValidationError('A chat room must have at least 2 participants.');
      }

      // If DM, check if one already exists
      if (!isGroup && participantIds.length === 2) {
        const otherUserId = participantIds.find((id) => id !== actorId);
        const existingRoom = await chatRoomRepository.findDirectRoom(actorId, otherUserId);
        if (existingRoom) {
          return existingRoom;
        }
      }

      return chatRoomRepository.createRoom({
        name: isGroup ? name || 'Group Chat' : null,
        isGroup,
        participantIds,
      });
    },

    async listRoomsForUser(userId) {
      return chatRoomRepository.listUserRooms(userId);
    },
  };
}

module.exports = {
  createMessageService,
};
