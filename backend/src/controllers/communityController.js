const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.getAllCommunities = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.communityService.listCommunities(req.query);

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.createCommunity = asyncHandler(async (req, res) => {
  const community = await req.app.locals.services.communityService.createCommunity(req.body, req.user);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Community created successfully.',
    code: 'COMMUNITY_CREATED',
    data: community,
  });
});
