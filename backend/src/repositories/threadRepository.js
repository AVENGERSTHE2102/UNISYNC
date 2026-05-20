function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createThreadRepository({ Thread }) {
  return {
    async listByCommunityId(communityId, { limit, offset }) {
      const result = await Thread.findAndCountAll({
        where: { communityId },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        count: result.count,
        rows: result.rows.map(toPlain),
      };
    },
    async create(payload) {
      return toPlain(await Thread.create(payload));
    },
    async findById(id) {
      return toPlain(await Thread.findByPk(id));
    },
  };
}

module.exports = {
  createThreadRepository,
};
