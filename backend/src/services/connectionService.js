const { AppError } = require('../utils/appError');

function createConnectionService({ connectionRepository, userRepository, chatRoomRepository }) {
  return {
    async sendRequest({ requesterId, receiverId }) {
      if (Number(requesterId) === Number(receiverId)) {
        throw new AppError('Cannot send connection request to yourself.', { statusCode: 400 });
      }
      
      const receiver = await userRepository.findById(receiverId);
      if (!receiver) {
        throw new AppError('Receiver not found.', { statusCode: 404 });
      }

      const existing = await connectionRepository.findAnyExisting(requesterId, receiverId);
      if (existing) {
        throw new AppError('Connection or request already exists.', { statusCode: 409 });
      }

      const request = await connectionRepository.create({
        requesterId,
        receiverId,
        status: 'pending'
      });

      return connectionRepository.findById(request.id);
    },

    async listUserConnections(userId) {
      return connectionRepository.listUserConnections(userId);
    },

    async updateRequestStatus({ requestId, userId, status }) {
      const request = await connectionRepository.findById(requestId);
      
      if (!request) {
        throw new AppError('Connection request not found.', { statusCode: 404 });
      }

      if (request.receiverId !== userId) {
        throw new AppError('You are not authorized to respond to this request.', { statusCode: 403 });
      }

      if (request.status !== 'pending') {
        throw new AppError(`Request is already ${request.status}.`, { statusCode: 400 });
      }

      if (status !== 'accepted' && status !== 'rejected') {
        throw new AppError('Invalid status update.', { statusCode: 400 });
      }

      const updated = await connectionRepository.updateStatus(requestId, status);

      // If accepted, ensure a chat room exists
      let roomId = null;
      if (status === 'accepted') {
        let room = await chatRoomRepository.findDirectRoom(request.requesterId, request.receiverId);
        if (!room) {
          room = await chatRoomRepository.createRoom({
            name: null,
            isGroup: false,
            participantIds: [request.requesterId, request.receiverId]
          });
        }
        roomId = room.id;
      }

      return { connection: updated, roomId };
    }
  };
}

module.exports = {
  createConnectionService,
};
