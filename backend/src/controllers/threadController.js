const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.getAllThreads = asyncHandler(async (req, res) => {
  const communityId = Number(req.params.communityId);
  const result = await req.app.locals.services.threadService.listThreads(communityId, req.query);

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.createThread = asyncHandler(async (req, res) => {
  const communityId = Number(req.params.communityId);
  const thread = await req.app.locals.services.threadService.createThread(communityId, req.body, req.user);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Thread created successfully.',
    code: 'THREAD_CREATED',
    data: thread,
  });
});
