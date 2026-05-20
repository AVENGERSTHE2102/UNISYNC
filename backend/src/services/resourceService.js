const { AuthorizationError, NotFoundError, ValidationError } = require('../utils/appError');
const path = require('path');

function createResourceService({ resourceRepository, membershipRepository, communityService }) {
  return {
    async uploadResource(communityId, filePayload, bodyPayload, actor) {
      if (!filePayload) {
        throw new ValidationError('File is required.');
      }

      await communityService.ensureCommunityExists(communityId);

      const isMember = await membershipRepository.isMember(communityId, actor.id);
      if (!isMember) {
        throw new AuthorizationError('You must be a member of this community to upload resources.');
      }

      const title = bodyPayload.title || filePayload.originalname;
      const tags = bodyPayload.tags || null;

      return resourceRepository.create({
        title,
        fileUrl: filePayload.filename,
        uploadedBy: actor.id,
        communityId: Number(communityId),
        tags,
      });
    },

    async listResources(communityId, actor) {
      await communityService.ensureCommunityExists(communityId);

      const isMember = await membershipRepository.isMember(communityId, actor.id);
      if (!isMember) {
        throw new AuthorizationError('You must be a member of this community to list resources.');
      }

      return resourceRepository.listByCommunityId(communityId);
    },

    async getResourceForDownload(communityId, resourceId, actor) {
      await communityService.ensureCommunityExists(communityId);

      const isMember = await membershipRepository.isMember(communityId, actor.id);
      if (!isMember) {
        throw new AuthorizationError('You must be a member of this community to download resources.');
      }

      const resource = await resourceRepository.findById(resourceId);
      if (!resource || resource.communityId !== Number(communityId)) {
        throw new NotFoundError('Resource not found.');
      }

      const filePath = path.resolve(process.cwd(), 'uploads', resource.fileUrl);

      return {
        resource,
        filePath,
      };
    },
  };
}

module.exports = {
  createResourceService,
};
