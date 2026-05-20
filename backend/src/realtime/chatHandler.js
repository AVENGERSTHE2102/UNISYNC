const logger = require('../config/logger');

function registerChatHandlers(
  io,
  socket,
  { messageService, verifyMembership, presence }
) {
  /** Join a chat room */
  socket.on('room:join', async (roomId, ack) => {
    try {
      await verifyMembership(socket, roomId);
      socket.join(String(roomId));
      await presence.setOnline(roomId, socket.user.id);

      // Broadcast updated online participants to the room
      const onlineUsers = await presence.getOnline(roomId);
      io.to(String(roomId)).emit('presence:update', onlineUsers);

      ack?.({ ok: true });
    } catch (err) {
      logger.warn(
        { err: err.message, userId: socket.user.id, roomId },
        'room:join denied'
      );
      ack?.({ ok: false, code: err.message });
    }
  });

  /** Send a message */
  socket.on('chat:send', async ({ roomId, content }, ack) => {
    try {
      await verifyMembership(socket, roomId);

      const msg = await messageService.saveMessage({
        roomId,
        senderId: socket.user.id,
        content,
      });

      // Broadcast message to everyone in the room
      io.to(String(roomId)).emit('chat:message', msg);
      ack?.({ ok: true, message: msg });
    } catch (err) {
      ack?.({ ok: false, code: err.message });
    }
  });

  /** Typing indicator start */
  socket.on('typing:start', (roomId) => {
    socket
      .to(String(roomId))
      .emit('typing:update', { userId: socket.user.id, typing: true });
  });

  /** Typing indicator stop */
  socket.on('typing:stop', (roomId) => {
    socket
      .to(String(roomId))
      .emit('typing:update', { userId: socket.user.id, typing: false });
  });

  /** Disconnect and clean up presence */
  socket.on('disconnecting', async () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        await presence.setOffline(room, socket.user.id);
        const onlineUsers = await presence.getOnline(room);
        io.to(room).emit('presence:update', onlineUsers);
      }
    }
  });
}

module.exports = {
  registerChatHandlers,
};
