const jwt = require('jsonwebtoken');
const env = require('../config/env');

function createSocketGuards({ authService, chatRoomRepository }) {
  return {
    async verifyToken(socket, next) {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('AUTH_MISSING'));
      }

      try {
        const payload = jwt.verify(token, env.jwtSecret);
        const user = await authService.getCurrentUser(payload.sub);
        if (!user) {
          return next(new Error('USER_NOT_FOUND'));
        }
        socket.user = user;
        next();
      } catch (err) {
        next(new Error('AUTH_INVALID'));
      }
    },

    async verifyMembership(socket, roomId) {
      const isMember = await chatRoomRepository.hasMember(roomId, socket.user.id);
      if (!isMember) {
        throw new Error('NOT_A_MEMBER');
      }
      return true;
    },
  };
}

module.exports = {
  createSocketGuards,
};
