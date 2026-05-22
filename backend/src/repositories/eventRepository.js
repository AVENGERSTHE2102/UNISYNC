function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createEventRepository({ Event, EventRegistration }) {
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
    async register(eventId, userId) {
      // Avoid duplicate registrations
      const existing = await EventRegistration.findOne({ where: { eventId, userId } });
      if (existing) return toPlain(existing);
      return toPlain(await EventRegistration.create({ eventId, userId }));
    },
    async getTickets(userId) {
      const registrations = await EventRegistration.findAll({
        where: { userId },
        include: [{ model: Event }],
      });
      return registrations.map(toPlain);
    }
  };
}

module.exports = {
  createEventRepository,
};
