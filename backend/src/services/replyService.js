const { AuthorizationError } = require('../utils/appError');
const { parsePagination } = require('../utils/pagination');

function createReplyService({ replyRepository, threadService, membershipRepository }) {
  return {
    async listReplies(threadId, query) {
      await threadService.ensureThreadExists(threadId);
      const pagination = parsePagination(query);
      const result = await replyRepository.listByThreadId(threadId, pagination);

      return {
        items: result.rows,
        meta: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.count,
        },
      };
    },
    async createReply(threadId, payload, actor) {
      const thread = await threadService.ensureThreadExists(threadId);

      const isMember = await membershipRepository.isMember(thread.communityId, actor.id);
      if (!isMember) {
        throw new AuthorizationError('You must be a member of this community to reply to threads.');
      }

      return replyRepository.create({
        threadId,
        authorId: actor.id,
        body: payload.body,
      });
    },
  };
}

module.exports = {
  createReplyService,
};
