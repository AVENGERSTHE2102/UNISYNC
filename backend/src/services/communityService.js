const { NotFoundError } = require('../utils/appError');
const { parsePagination } = require('../utils/pagination');

function createCommunityService({ communityRepository }) {
  return {
    async listCommunities(query) {
      const pagination = parsePagination(query);
      const result = await communityRepository.list(pagination);

      return {
        items: result.rows,
        meta: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.count,
        },
      };
    },
    async createCommunity(payload, actor) {
      return communityRepository.create({
        name: payload.name,
        description: payload.description,
        category: payload.category,
        createdBy: actor.id,
      });
    },
    async ensureCommunityExists(communityId) {
      const community = await communityRepository.findById(communityId);

      if (!community) {
        throw new NotFoundError('Community not found.');
      }

      return community;
    },
  };
}

module.exports = {
  createCommunityService,
};
