const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.getAllReplies = asyncHandler(async (req, res) => {
  const threadId = Number(req.params.threadId);
  const result = await req.app.locals.services.replyService.listReplies(threadId, req.query);

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.createReply = asyncHandler(async (req, res) => {
  const threadId = Number(req.params.threadId);
  const reply = await req.app.locals.services.replyService.createReply(threadId, req.body, req.user);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Reply created successfully.',
    code: 'REPLY_CREATED',
    data: reply,
  });
});
