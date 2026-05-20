function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createCommunityRepository({ Community }) {
  return {
    async list({ limit, offset }) {
      const result = await Community.findAndCountAll({
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
      return toPlain(await Community.create(payload));
    },
    async findById(id) {
      return toPlain(await Community.findByPk(id));
    },
  };
}

module.exports = {
  createCommunityRepository,
};
