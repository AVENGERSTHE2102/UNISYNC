function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createReplyRepository({ Reply }) {
  return {
    async listByThreadId(threadId, { limit, offset }) {
      const result = await Reply.findAndCountAll({
        where: { threadId },
        limit,
        offset,
        order: [['createdAt', 'ASC']],
      });

      return {
        count: result.count,
        rows: result.rows.map(toPlain),
      };
    },
    async create(payload) {
      return toPlain(await Reply.create(payload));
    },
  };
}

module.exports = {
  createReplyRepository,
};
