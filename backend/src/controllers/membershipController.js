const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.joinCommunity = asyncHandler(async (req, res) => {
  const communityId = req.params.communityId;
  const membership = await req.app.locals.services.membershipService.joinCommunity(communityId, req.user.id);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Joined community successfully.',
    code: 'JOINED_COMMUNITY',
    data: membership,
  });
});

exports.leaveCommunity = asyncHandler(async (req, res) => {
  const communityId = req.params.communityId;
  const result = await req.app.locals.services.membershipService.leaveCommunity(communityId, req.user.id);

  sendSuccess(res, {
    message: 'Left community successfully.',
    code: 'LEFT_COMMUNITY',
    data: result,
  });
});
