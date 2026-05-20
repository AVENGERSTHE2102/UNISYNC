const { ConflictError, NotFoundError } = require('../utils/appError');

function createMembershipService({ membershipRepository, communityService }) {
  return {
    async joinCommunity(communityId, userId) {
      await communityService.ensureCommunityExists(communityId);

      const alreadyMember = await membershipRepository.isMember(communityId, userId);
      if (alreadyMember) {
        throw new ConflictError('You are already a member of this community.');
      }

      return membershipRepository.create({ communityId, userId });
    },

    async leaveCommunity(communityId, userId) {
      await communityService.ensureCommunityExists(communityId);

      const isMember = await membershipRepository.isMember(communityId, userId);
      if (!isMember) {
        throw new NotFoundError('You are not a member of this community.');
      }

      await membershipRepository.delete({ communityId, userId });
      return { success: true };
    },
  };
}

module.exports = {
  createMembershipService,
};
