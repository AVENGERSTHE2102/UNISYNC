function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createMembershipRepository({ Membership, User }) {
  return {
    async create({ communityId, userId }) {
      return toPlain(await Membership.create({ communityId, userId }));
    },

    async delete({ communityId, userId }) {
      return Membership.destroy({
        where: { communityId, userId },
      });
    },

    async isMember(communityId, userId) {
      const record = await Membership.findOne({
        where: { communityId, userId },
      });
      return record !== null;
    },

    async listMembers(communityId) {
      const records = await Membership.findAll({
        where: { communityId },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email', 'role', 'avatarUrl'],
          },
        ],
      });
      return records.map(toPlain);
    },
  };
}

module.exports = {
  createMembershipRepository,
};
