const { NotFoundError, AuthorizationError } = require('../utils/appError');
const { parsePagination } = require('../utils/pagination');

function createThreadService({ threadRepository, communityService, membershipRepository }) {
  return {
    async listThreads(communityId, query) {
      await communityService.ensureCommunityExists(communityId);
      const pagination = parsePagination(query);
      const result = await threadRepository.listByCommunityId(communityId, pagination);

      return {
        items: result.rows,
        meta: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.count,
        },
      };
    },
    async createThread(communityId, payload, actor) {
      await communityService.ensureCommunityExists(communityId);

      const isMember = await membershipRepository.isMember(communityId, actor.id);
      if (!isMember) {
        throw new AuthorizationError('You must be a member of this community to create a thread.');
      }

      return threadRepository.create({
        communityId,
        authorId: actor.id,
        title: payload.title,
        body: payload.body,
      });
    },
    async ensureThreadExists(threadId) {
      const thread = await threadRepository.findById(threadId);

      if (!thread) {
        throw new NotFoundError('Thread not found.');
      }

      return thread;
    },
  };
}

module.exports = {
  createThreadService,
};
