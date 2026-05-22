const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.listRooms = asyncHandler(async (req, res) => {
  const rooms = await req.app.locals.services.messageService.listRoomsForUser(
    req.user.id
  );

  sendSuccess(res, {
    data: rooms,
  });
});

exports.createRoom = asyncHandler(async (req, res) => {
  const room = await req.app.locals.services.messageService.createRoom(
    req.user.id,
    req.body
  );

  sendSuccess(res, {
    statusCode: 201,
    message: 'Chat room created successfully.',
    data: room,
  });
});

exports.getMessages = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.roomId);
  const result = await req.app.locals.services.messageService.listMessages(
    roomId,
    req.user.id,
    req.query
  );

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.markRoomAsRead = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.roomId);
  await req.app.locals.services.messageService.markRoomAsRead(roomId, req.user.id);
  sendSuccess(res, { message: 'Room marked as read' });
});
