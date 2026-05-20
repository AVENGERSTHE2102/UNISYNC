const { parsePagination } = require('../utils/pagination');

function createEventService({ eventRepository }) {
  return {
    async listEvents(query) {
      const pagination = parsePagination(query);
      const result = await eventRepository.list(pagination);

      return {
        items: result.rows,
        meta: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.count,
        },
      };
    },
    async createEvent(payload, actor) {
      return eventRepository.create({
        organizerId: actor.id,
        title: payload.title,
        description: payload.description,
        date: payload.date,
        location: payload.location,
        type: payload.type,
      });
    },
  };
}

module.exports = {
  createEventService,
};
