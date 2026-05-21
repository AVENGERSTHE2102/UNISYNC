const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.sendRequest = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;
  const result = await req.app.locals.services.connectionService.sendRequest({
    requesterId: req.user.id,
    receiverId,
  });

  sendSuccess(res, {
    statusCode: 201,
    message: 'Connection request sent successfully.',
    data: result,
  });
});

exports.listConnections = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.connectionService.listUserConnections(req.user.id);
  
  sendSuccess(res, {
    data: result,
  });
});

exports.updateConnectionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await req.app.locals.services.connectionService.updateRequestStatus({
    requestId: id,
    userId: req.user.id,
    status,
  });

  sendSuccess(res, {
    message: `Connection request ${status}.`,
    data: result,
  });
});
