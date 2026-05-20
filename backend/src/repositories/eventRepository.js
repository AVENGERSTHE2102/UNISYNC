function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createEventRepository({ Event }) {
  return {
    async list({ limit, offset }) {
      const result = await Event.findAndCountAll({
        limit,
        offset,
        order: [['date', 'ASC']],
      });

      return {
        count: result.count,
        rows: result.rows.map(toPlain),
      };
    },
    async create(payload) {
      return toPlain(await Event.create(payload));
    },
  };
}

module.exports = {
  createEventRepository,
};
