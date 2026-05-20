function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createResourceRepository({ Resource }) {
  return {
    async create(payload) {
      return toPlain(await Resource.create(payload));
    },
    async listByCommunityId(communityId) {
      const rows = await Resource.findAll({
        where: { communityId },
        order: [['createdAt', 'DESC']],
      });
      return rows.map(toPlain);
    },
    async findById(id) {
      return toPlain(await Resource.findByPk(id));
    },
  };
}

module.exports = {
  createResourceRepository,
};
