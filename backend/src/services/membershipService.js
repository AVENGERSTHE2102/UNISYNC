const { ConflictError, NotFoundError } = require('../utils/appError');

function createMembershipService({ membershipRepository, communityService, chatRoomRepository }) {
  return {
    async joinCommunity(communityId, userId) {
      const community = await communityService.ensureCommunityExists(communityId);

      const alreadyMember = await membershipRepository.isMember(communityId, userId);
      if (alreadyMember) {
        throw new ConflictError('You are already a member of this community.');
      }

      const membership = await membershipRepository.create({ communityId, userId });

      let roomId = community.chatRoomId;
      if (!roomId) {
        // Backfill a chat room for this legacy community
        const chatRoom = await chatRoomRepository.createRoom({
          name: community.name,
          isGroup: true,
          participantIds: []
        });
        roomId = chatRoom.id;
        await communityService.updateCommunityChatRoom(communityId, roomId);
      }

      if (roomId) {
        await chatRoomRepository.addParticipant(roomId, userId);
      }

      return { membership, chatRoomId: roomId };
    },

    async leaveCommunity(communityId, userId) {
      const community = await communityService.ensureCommunityExists(communityId);

      const isMember = await membershipRepository.isMember(communityId, userId);
      if (!isMember) {
        throw new NotFoundError('You are not a member of this community.');
      }

      await membershipRepository.delete({ communityId, userId });

      if (community.chatRoomId) {
        await chatRoomRepository.removeParticipant(community.chatRoomId, userId);
      }

      return { success: true };
    },

    async listUserMemberships(userId) {
      return membershipRepository.listUserMemberships(userId);
    },
  };
}

module.exports = {
  createMembershipService,
};
