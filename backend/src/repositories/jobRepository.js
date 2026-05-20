function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createJobRepository({ Job }) {
  return {
    async list({ limit, offset }) {
      const result = await Job.findAndCountAll({
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
      return toPlain(await Job.create(payload));
    },
  };
}

module.exports = {
  createJobRepository,
};
