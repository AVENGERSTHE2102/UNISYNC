const { Server } = require('socket.io');
const env = require('../config/env');
const logger = require('../config/logger');
const { createSocketGuards } = require('./guards');
const { registerChatHandlers } = require('./chatHandler');
const presence = require('./presence');

function registerRealtime(server, container) {
  const io = new Server(server, {
    cors: {
      origin: env.corsOrigin === '*' ? true : env.corsOrigin,
      credentials: true,
    },
    maxHttpBufferSize: 1e6, // 1MB max message size for flood protection
  });

  const guards = createSocketGuards({
    authService: container.services.authService,
    chatRoomRepository: container.repositories.chatRoomRepository,
  });

  // Auth handshake middleware
  io.use((socket, next) => {
    guards.verifyToken(socket, next);
  });

  io.on('connection', (socket) => {
    logger.info(
      { userId: socket.user?.id, socketId: socket.id },
      'realtime.client_connected'
    );

    registerChatHandlers(io, socket, {
      messageService: container.services.messageService,
      verifyMembership: guards.verifyMembership.bind(guards),
      presence,
    });

    socket.on('disconnect', () => {
      logger.info(
        { userId: socket.user?.id, socketId: socket.id },
        'realtime.client_disconnected'
      );
    });
  });

  return io;
}

module.exports = {
  registerRealtime,
};
