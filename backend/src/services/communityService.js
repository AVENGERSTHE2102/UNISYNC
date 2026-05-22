const { NotFoundError } = require('../utils/appError');
const { parsePagination } = require('../utils/pagination');

function createCommunityService({ communityRepository, chatRoomRepository }) {
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
      const chatRoom = await chatRoomRepository.createRoom({
        name: payload.name,
        isGroup: true,
        participantIds: [actor.id] // the creator automatically joins
      });

      return communityRepository.create({
        name: payload.name,
        description: payload.description,
        category: payload.category,
        createdBy: actor.id,
        chatRoomId: chatRoom.id,
      });
    },
    async ensureCommunityExists(communityId) {
      const community = await communityRepository.findById(communityId);

      if (!community) {
        throw new NotFoundError('Community not found.');
      }

      return community;
    },
    async updateCommunityChatRoom(communityId, chatRoomId) {
      await communityRepository.updateChatRoomId(communityId, chatRoomId);
    },
    async getCommunity(communityId) {
      const community = await communityRepository.findByIdWithMemberCount(communityId);
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
