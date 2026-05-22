const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.getAllEvents = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.eventService.listEvents(req.query);

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.createEvent = asyncHandler(async (req, res) => {
  const event = await req.app.locals.services.eventService.createEvent(req.body, req.user);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Event created successfully.',
    code: 'EVENT_CREATED',
    data: event,
  });
});

exports.registerForEvent = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.eventService.registerForEvent(req.params.id, req.user);
  sendSuccess(res, {
    message: 'Successfully registered for event.',
    data: result,
  });
});

exports.getMyTickets = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.eventService.getMyTickets(req.user);
  sendSuccess(res, {
    data: result,
  });
});
