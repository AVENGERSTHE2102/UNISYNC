const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.uploadResource = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const resource = await req.app.locals.services.resourceService.uploadResource(
    communityId,
    req.file,
    req.body,
    req.user
  );

  sendSuccess(res, {
    statusCode: 201,
    message: 'Resource uploaded successfully.',
    code: 'RESOURCE_UPLOADED',
    data: resource,
  });
});

exports.listResources = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const resources = await req.app.locals.services.resourceService.listResources(
    communityId,
    req.user
  );

  sendSuccess(res, {
    message: 'Resources retrieved successfully.',
    code: 'RESOURCES_LISTED',
    data: resources,
  });
});

exports.downloadResource = asyncHandler(async (req, res) => {
  const { communityId, resourceId } = req.params;
  const { resource, filePath } = await req.app.locals.services.resourceService.getResourceForDownload(
    communityId,
    resourceId,
    req.user
  );

  res.download(filePath, resource.title);
});
